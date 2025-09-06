// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"
// Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Components
import { UploadForm } from "./components/UploadForm"

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

          <div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>

            {res.map(file => (
              <div key={file.id} className={'border p-4'}>

                <p>{file.title}</p>

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
