// Drizzle
import { db } from "@/db/db-client"
import { file_status, files } from "@/db/schema/files"
import { desc, sql } from "drizzle-orm"
// Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
// Components
import { UploadForm } from "./components/UploadForm"
import { DownloadButton } from "./components/DownloadButton"
import { DeleteButton } from "./components/DeleteButton"
import { EmbedButton } from "./components/EmbedButton"
import { PaginationControls } from "@/app/components/Pagination"
// Next
import Image from "next/image"
// Libs
import dayjs from 'dayjs'
// Icons
import { AlertCircle, Ban, CircleDashed, FileCheck } from "lucide-react"

type Props = {
  searchParams: Promise<{
    page: string
  }>
}

export default async function Files({ searchParams }: Props) {

  const { page } = await searchParams

  const parsed_page = parseInt(page || "1")
  const limit = 6
  const offset = (parsed_page - 1) * limit

  const files_data = await db.select({ // MUST NOT select 'content_text' (very large)
    id: files.id,
    extension: files.extension,
    title: files.title,
    size: files.size,
    status: files.status,
    char_count: files.char_count,
    created_at: files.created_at,
    token: files.token
  })
    .from(files)
    .orderBy(desc(files.created_at))
    .limit(limit)
    .offset(offset)

  const count = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(files)

  const statusMap = (status: typeof file_status.enumValues[number]) => {
    if (status === 'Failed') {
      return { Icon: <Ban />, bg: 'bg-destructive/10', border: 'border-destructive/40', text: 'text-destructive' }
    } else if (status === 'Processed') {
      return { Icon: <FileCheck />, bg: 'bg-chart-2/10', border: 'border-chart-2/40', text: 'text-chart-2' }
    } else {
      return { Icon: <CircleDashed />, bg: 'bg-primary/10', border: 'border-primary/25', text: 'text-primary' }
    }
  }

  return (
    <section className={'mt-4'}>

      <Tabs defaultValue={'list'}>
        <TabsList className={'w-full'}>
          <TabsTrigger value="list">All Files</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {(files_data && files_data.length > 0) ?

            <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh-180px)] overflow-y-scroll'}>

              {files_data.map(file => (
                <article key={file.id} className={'border shadow p-4 rounded-md flex items-start gap-4'}>
                  <Image
                    width={70}
                    height={70}
                    className={'w-8'}
                    src={`/file-icons/${file.extension}-logo.png`}
                    alt={'File Extension Icon'} />

                  <div className={'flex-1 flex flex-col gap-2'}>
                    <div>
                      <h2 className={'text-sm font-medium'}>{file.title}</h2>
                      <p className={'text-muted-foreground text-xs mt-1'}>
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className={'text-muted-foreground text-xs'}>
                        Extracted char count: {file.char_count}
                      </p>
                      <p className={'text-muted-foreground text-xs'}>
                        Uploaded at: {dayjs(file.created_at).format('MM/DD/YYYY, hh:mm A')}
                      </p>
                    </div>

                    <div className={'flex gap-1 justify-between items-center'}>
                      <Badge className={`${statusMap(file.status).bg} ${statusMap(file.status).text} ${statusMap(file.status).border}`}>
                        {file.status}{statusMap(file.status)?.Icon}
                      </Badge>
                      <div className={'flex items-center'}>
                        {file.status === 'Pending' &&
                          <EmbedButton
                            token={file.token} />}

                        <DownloadButton
                          filename={file.title + '.' + file.extension}
                          token={file.token} />

                        <DeleteButton
                          filename={file.title + '.' + file.extension}
                          token={file.token} />
                      </div>
                    </div>

                  </div>
                </article>
              ))}

            </div>
            :
            <div className={'h-20 flex justify-center items-center'}>
              <p className={'text-muted-foreground text-sm'}>
                No files uploaded yet
              </p>
            </div>}

          <PaginationControls
            current_page={parsed_page}
            total_items={count[0].count}
            items_per_page={limit} />
        </TabsContent>
        <TabsContent value="upload">

          <UploadForm />

          <div className={'flex flex-col gap-2 items-center mt-12'}>
            <p className={'text-muted-foreground text-xs text-center'}>
              This tool extracts text <span className={'font-bold'}>directly from the PDF</span>. <br />
              If your file is a scanned document or image-only PDF, the text <span className={'font-bold'}>may not appear</span>.
            </p>
            <AlertCircle size={16} />
          </div>

        </TabsContent>
      </Tabs>

    </section>
  )
}
