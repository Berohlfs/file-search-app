// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
// Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Components
import { UploadForm } from "./components/UploadForm"
import { DownloadButton } from "./components/DownloadButton"

export default async function Home() {

  const res = await db.select().from(files)

  return (
    <section className={'mt-4'}>

      <Tabs defaultValue="list">
        <TabsList className={'w-full'}>
          <TabsTrigger value="list">My Files</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>
        <TabsContent value="list">

          <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh-200px)] overflow-y-scroll'}>

            {res.map(file => (
              <div key={file.id} className={'border p-4 rounded-md shadow'}>

                <p>{file.title}</p>
                <p>{file.extension}</p>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <DownloadButton
                  filename={file.title + '.' + file.extension}
                  token={file.token} />

              </div>
            ))}

          </div>

        </TabsContent>
        <TabsContent value="upload">

          <UploadForm />

        </TabsContent>
      </Tabs>

    </section>
  )
}
