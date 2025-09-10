'use server'

// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
import { eq } from "drizzle-orm"
import { file_chunks } from "@/db/schema/file_chunks"
// Libs
import { TokenTextSplitter } from "@langchain/textsplitters"
// Next
import { revalidatePath } from "next/cache"
// OpenAI
import { openai } from "@/db/openai-client"

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

        const splitter = new TokenTextSplitter({
            chunkSize: 300,
            chunkOverlap: 50,
            encodingName: 'cl100k_base'
        })

        const chunks = await splitter.createDocuments([file.content_text])

        const texts = chunks.map(c => c.pageContent) as string[]

        const resp = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: texts,
        })

        const rows = resp.data.map(d => ({
            content_text: texts[d.index],
            embedding: d.embedding,
            char_count: texts[d.index].length,
            file_id: file.id,
            position: d.index + 1
        }))

        await db.transaction(async tx => {
            await tx.insert(file_chunks).values(rows)

            await tx.update(files).set({ status: 'Processed' }).where(eq(files.token, token))
        })
    } catch (error) {
        console.log(error)
        return 'Unexpected error while embedding file.'
    } finally {
        revalidatePath('/search')
    }
}
