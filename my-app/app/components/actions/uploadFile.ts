'use server'

// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
// S3
import { s3 } from "@/db/s3-client"
// Libs
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand } from "@aws-sdk/client-s3"
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
            return 'Invalid data.'
        }

        if (file.size === 0) {
            return 'Please, select a file.'
        }

        const token = uuidv4()

        const bytes = new Uint8Array(await file.arrayBuffer())

        const name = file.name

        const extension = name.includes(".")
            ? name.split(".").pop()!.toLowerCase()
            : ""

        await db.transaction(async tx => {
            await tx.insert(files).values({
                extension: extension,
                title: data.title,
                size: file.size,
                bucket_ref: token,
            })
            await s3.send(new PutObjectCommand({
                Bucket: 'files',
                Key: token,
                Body: bytes,
                ContentType: file.type,
                ContentLength: bytes.byteLength
            }))
        })

        revalidatePath('/')
    } catch (error) {
        console.log(error)
        return 'Unexpected error while uploading file.'
    }
}