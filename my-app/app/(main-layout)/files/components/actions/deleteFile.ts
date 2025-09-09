'use server'

// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
import { eq } from "drizzle-orm"
// S3
import { s3 } from "@/db/s3-client"
// Next
import { revalidatePath } from "next/cache"
// Libs
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

export const deleteFile = async (token: string) => {
    try {
        await db.transaction(async tx => {
            const [deleted] = await tx.delete(files)
                .where(eq(files.token, token))
                .returning()

            await s3.send(new DeleteObjectCommand({
                Bucket: 'files',
                Key: deleted.bucket_ref
            }))
        })

        revalidatePath('/')
    } catch (error) {
        console.log(error)
        return 'Unexpected error while deleting file.'
    }
}