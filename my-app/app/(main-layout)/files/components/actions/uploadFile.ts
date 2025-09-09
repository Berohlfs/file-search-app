'use server'

// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
// S3
import { s3 } from "@/db/s3-client"
// Libs
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { extractText, getDocumentProxy } from "unpdf"
// Validation
import { upload_form_validation } from "@/validation/uploadFile"
// Next
import { revalidatePath } from "next/cache"

export const uploadFile = async (fd: FormData) => {
    try {
        const unvalidated_data = {
            title: String(fd.get('title') ?? ''),
        }

        const file = fd.get('file') as File | null

        const { success, data } = upload_form_validation.safeParse(unvalidated_data)

        if (!success || !file) {
            return 'Invalid/missing data.'
        }

        if (file.size === 0) {
            return 'Please, select a file.'
        }

        const name = file.name

        const extension = name.includes(".")
            ? name.split(".").pop()!.toLowerCase()
            : ""

        if (!(
            (extension === 'pdf' && file.type === 'application/pdf') ||
            (extension === 'txt' && file.type === 'text/plain')
        )) {
            return 'Only PDF or TXT are allowed.'
        }

        const ab = await file.arrayBuffer()
        const abCloned = ab.slice(0)
        const bytes = new Uint8Array(abCloned)
        const buf = Buffer.from(bytes) 

        let content_text = ''
        if (file.type === 'application/pdf') {
            const { text } = await extractText(bytes, { mergePages: true })
            content_text = text ?? ''
        } else {
            content_text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
        }

        const token = uuidv4()

        await db.transaction(async tx => {
            await tx.insert(files).values({
                content_text: content_text,
                char_count: content_text.length,
                mime_type: file.type,
                extension: extension,
                title: data.title,
                size: file.size,
                bucket_ref: token,
            })
            await s3.send(new PutObjectCommand({
                Bucket: 'files',
                Key: token,
                Body: buf,
                ContentType: file.type,
                ContentLength: buf.byteLength
            }))
        })

        revalidatePath('/')
    } catch (error) {
        console.log(error)
        return 'Unexpected error while uploading file.'
    }
}