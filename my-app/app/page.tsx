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

          {res.map((file, index) => (
            <p key={file.id}>{index + 1}º file: {file.title}</p>
          ))}

        </TabsContent>
        <TabsContent value="upload">

          <UploadForm />

        </TabsContent>
      </Tabs>

    </section>
  )
}
