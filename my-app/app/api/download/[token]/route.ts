// Next
import { NextRequest } from "next/server"
// Libs
import { GetObjectCommand } from "@aws-sdk/client-s3"
// S3
import { s3 } from "@/db/s3-client"
// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
import { eq } from "drizzle-orm"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
    try {
        const token = decodeURIComponent(params.token)

        const [file] = await db.select().from(files).where(eq(files.token, token))

        if (!file) {
            return new Response("Not found.", { status: 404 })
        }

        const obj = await s3.send(new GetObjectCommand({ Bucket: 'files', Key: file.bucket_ref }))

        let stream: ReadableStream | null = null

        if (obj.Body) {
            if ("transformToWebStream" in obj.Body) {
                stream = (obj.Body as { transformToWebStream: () => ReadableStream }).transformToWebStream()
            } else {
                stream = obj.Body as unknown as ReadableStream
            }
        }

        if (!stream) {
            return new Response("No content", { status: 404 })
        }

        return new Response(stream, {
            headers: {
                "Content-Type": obj.ContentType || "application/octet-stream"
            },
        })
    } catch (err) {
        return new Response("File not found or unavailable.", { status: 404 })
    }
}
