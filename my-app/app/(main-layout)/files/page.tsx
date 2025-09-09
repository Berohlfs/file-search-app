// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
import { desc } from "drizzle-orm"
// Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Components
import { UploadForm } from "./components/UploadForm"
import { DownloadButton } from "./components/DownloadButton"
import { DeleteButton } from "./components/DeletedButton"
// Next
import Image from "next/image"
// Libs
import dayjs from 'dayjs'
// Icons
import { AlertCircle } from "lucide-react"

export default async function Files() {

  const res = await db.select().from(files).orderBy(desc(files.created_at))

  return (
    <section className={'mt-4'}>

      <Tabs defaultValue={'list'}>
        <TabsList className={'w-full'}>
          <TabsTrigger value="list">All Files</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>
        <TabsContent value="list">

          <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh-180px)] overflow-y-scroll'}>

            {res.map(file => (
              <article key={file.id} className={'border shadow p-4 rounded-md flex items-center gap-1 justify-between'}>

                <div className={'flex items-center gap-4'}>
                  <Image
                    width={70}
                    height={70}
                    className={'w-10'}
                    src={`/file-icons/${file.extension}-logo.png`}
                    alt={'File Extension Icon'} />

                  <div>
                    <h2 className={'text-sm font-medium'}>{file.title}</h2>
                    <p className={'text-muted-foreground text-xs mt-2'}>
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className={'text-muted-foreground text-xs'}>
                      Extracted char count:{' '}
                      <span className={file.char_count < 1 ? 'text-destructive' : ''}>
                        {file.char_count}{file.char_count < 1 ? '*' : ''}
                      </span>
                    </p>
                    <p className={'text-muted-foreground text-xs mt-2'}>
                      Uploaded at: {dayjs(file.created_at).format('MM/DD/YYYY, hh:mm A')}
                    </p>
                  </div>
                </div>

                <div className={'flex gap-1'}>
                  <DownloadButton
                    filename={file.title + '.' + file.extension}
                    token={file.token} />

                  <DeleteButton
                    filename={file.title + '.' + file.extension}
                    token={file.token} />
                </div>

              </article>
            ))}

          </div>

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
