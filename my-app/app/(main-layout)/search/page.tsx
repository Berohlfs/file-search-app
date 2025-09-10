// Components
import { SearchControl } from "./components/SearchControl"
import { DownloadButton } from "../files/components/DownloadButton"
// OpenAI
import { openai } from "@/db/openai-client"
// Drizzle
import { db } from "@/db/db-client"
import { and, desc, eq, ilike, sql } from "drizzle-orm"
import { files } from "@/db/schema/files"
import { file_chunks } from "@/db/schema/file_chunks"
// Libs
import pgvector from 'pgvector'
// Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Icons
import { Eye, Sparkles } from "lucide-react"
// Next
import Link from "next/link"

type Props = {
    searchParams: Promise<{
        q: string
        semantic: string
    }>
}

export default async function Search({ searchParams }: Props) {

    const { q, semantic } = await searchParams

    const valid_search = q && q.length > 3

    let embedded_search_value: number[] | null = null

    if (valid_search && semantic === 'on') {
        const resp = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: [q],
        })
        embedded_search_value = pgvector.toSql(resp.data[0].embedding)
    }

    interface Result {
        id: number
        bucket_ref: string
        chunk_position: number
        token: string
        title: string
        preview: string
        extension: string
    }

    interface SemanticResult extends Result {
        distance: number
    }

    let semantic_search_data: SemanticResult[] | null = null

    if (embedded_search_value) {
        semantic_search_data = await db
            .select({
                id: file_chunks.id,
                chunk_position: file_chunks.position,
                bucket_ref: files.bucket_ref,
                token: files.token,
                title: files.title,
                extension: files.extension,
                preview: file_chunks.content_text,
                distance: sql<number>`${file_chunks.embedding} <-> ${embedded_search_value}`,
            })
            .from(file_chunks)
            .innerJoin(files, eq(files.id, file_chunks.file_id))
            .where(eq(files.status, 'Processed'))
            .orderBy(sql`${file_chunks.embedding} <-> ${embedded_search_value}`)
            .limit(6)
    }

    let traditional_search_data: Result[] | null = null

    if (valid_search) {
        traditional_search_data = await db
            .select({
                id: file_chunks.id,
                chunk_position: file_chunks.position,
                bucket_ref: files.bucket_ref,
                token: files.token,
                file_id: file_chunks.file_id,
                title: files.title,
                extension: files.extension,
                preview: file_chunks.content_text,
            })
            .from(file_chunks)
            .innerJoin(files, eq(files.id, file_chunks.file_id))
            .where(and(
                eq(files.status, 'Processed'),
                ilike(file_chunks.content_text, `%${q}%`)
            ))
            .orderBy(desc(files.created_at))
            .limit(6)
    }

    type PropsResultCard = {
        title: string,
        preview: string,
        chunk_position: number
        token: string
        extension: string
        bucket_ref: string

        distance?: number
        highlight?: boolean
    }

    const ResultCard = ({ title, preview, distance, highlight, token, extension, bucket_ref, chunk_position }: PropsResultCard) => (
        <article className={`flex flex-col gap-2 justify-between rounded-lg border p-3 shadow-sm ${highlight ? 'border-chart-2/20 border-3' : ''}`}>
            <div>
                <div className={'flex items-center gap-2 justify-between'}>
                    <p className="text-sm font-medium flex items-center gap-1">
                        {title}.{extension} ➡ <span className={'text-xs font-bold'}>chunk nº {chunk_position}</span>
                    </p>
                    {highlight &&
                        <Badge className={'bg-chart-2/20 text-chart-2 border-chart-2/20'}>
                            Best match <Sparkles />
                        </Badge>}
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                    {'"...'}<code>{preview}</code>{'..."'}
                </p>
                {distance &&
                    <div className="mt-2 text-xs text-muted-foreground font-medium italic">
                        Semantic Distance: {distance.toFixed(4)}
                    </div>}
            </div>
            <div className={'flex items-center justify-end'}>
                <Button
                    size={'sm'}
                    variant={'link'}
                    asChild>
                    <Link
                        prefetch={false}
                        href={`${process.env.SUPABASE_PUBLIC_FILES_URL}/${bucket_ref}`}
                        target={'_blank'}>
                        Preview <Eye />
                    </Link>
                </Button>
                <DownloadButton
                    variant={'complete'}
                    filename={title + '.' + extension}
                    token={token} />
            </div>
        </article>
    )


    const NoResults = () => (
        <div className={'h-20 flex justify-center items-center'}>
            <p className={'text-muted-foreground text-sm'}>
                No results
            </p>
        </div>
    )

    const GridWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[calc(100vh-380px)] overflow-y-scroll mt-2 px-1'}>
            {children}
        </div>
    )

    return (
        <section className={'mt-4'}>
            <SearchControl>

                {semantic === 'on' ?
                    <Tabs defaultValue={'semantic'}>
                        <TabsList className={'w-full'}>
                            <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
                            <TabsTrigger value="traditional">Traditional Search</TabsTrigger>
                        </TabsList>
                        <TabsContent value="semantic">

                            {(semantic_search_data && semantic_search_data.length > 0) ?
                                <GridWrapper>
                                    {semantic_search_data.map((row, index) => (
                                        <ResultCard
                                            bucket_ref={row.bucket_ref}
                                            token={row.token}
                                            extension={row.extension}
                                            chunk_position={row.chunk_position}
                                            highlight={index === 0 ? true : false}
                                            title={row.title}
                                            distance={row.distance}
                                            preview={row.preview}
                                            key={row.id} />
                                    ))}
                                </GridWrapper>
                                :
                                <NoResults />}

                        </TabsContent>
                        <TabsContent value="traditional">

                            {(traditional_search_data && traditional_search_data.length > 0) ?
                                <GridWrapper>
                                    {traditional_search_data.map((row) => (
                                        <ResultCard
                                            bucket_ref={row.bucket_ref}
                                            token={row.token}
                                            extension={row.extension}
                                            chunk_position={row.chunk_position}
                                            title={row.title}
                                            preview={row.preview}
                                            key={row.id} />
                                    ))}
                                </GridWrapper>
                                :
                                <NoResults />}

                        </TabsContent>
                    </Tabs>
                    :
                    (traditional_search_data && traditional_search_data.length > 0) ?
                        <GridWrapper>
                            {traditional_search_data.map((row) => (
                                <ResultCard
                                    bucket_ref={row.bucket_ref}
                                    token={row.token}
                                    extension={row.extension}
                                    chunk_position={row.chunk_position}
                                    title={row.title}
                                    preview={row.preview}
                                    key={row.id} />
                            ))}
                        </GridWrapper>
                        :
                        <NoResults />}
            </SearchControl>
        </section>
    )
}