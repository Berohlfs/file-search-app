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

export type UploadFileResponses = 'Invalid data.' | 'Please, select a file.' | 'File uploaded!' | 'Unexpected error while uploading file.' | null

export const uploadFile = async (
    _prev: UploadFileResponses,
    fd: FormData
): Promise<UploadFileResponses> => {
    try {

        const unvalidated_data = {
            title: String(fd.get('title') ?? '')
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

        await db.transaction(async tx => {
            await tx.insert(files).values({
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

        return 'File uploaded!'
    } catch (error) {
        console.log(error)
        return 'Unexpected error while uploading file.'
    }
}