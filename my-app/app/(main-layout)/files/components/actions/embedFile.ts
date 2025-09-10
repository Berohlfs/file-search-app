'use server'

// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
import { eq } from "drizzle-orm"
import { file_chunks } from "@/db/schema/file_chunks"
// Libs
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
// Next
import { revalidatePath } from "next/cache"

export const embedFile = async (token: string) => {
    try {
        const [file] = await db.select().from(files).where(eq(files.token, token))

        if (!file) {
            return "File not found."
        }
        if (file.status !== 'Pending') {
            return "This file has already undergone an embedding attempt."
        }

        // Temp status. If embedding is successful, status = Processed
        await db.update(files).set({ status: 'Failed' }).where(eq(files.token, token))

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 50,
        })

        const chunks = await splitter.createDocuments([file.content_text])

        const texts = chunks.map(c => c.pageContent) as string[]

        await db.transaction(async tx => {
            await tx.insert(file_chunks).values(texts.map(text => (
                { content_text: text, embedding: [1], char_count: text.length, file_id: file.id }
            )))

            await tx.update(files).set({ status: 'Processed' }).where(eq(files.token, token))
        })

        revalidatePath('')
    } catch (error) {
        console.log(error)
        return 'Unexpected error while embedding file.'
    }
}
