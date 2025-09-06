// Components
import { ModeToggle } from "./components/mode-toggle"
// Drizzle
import { db } from "@/db/db-client"
import { files } from "@/db/schema/files"

export default async function Home() {

  const res = await db.select().from(files)

  return (<main className={'flex flex-col items-center'}>

    <h1 className={'text-center my-10 text-3xl font-medium'}>File Search App</h1>

    <ModeToggle />

    <section className={'mt-10'}>

      {res.map((file, index) => (
        <p key={file.id}>{index + 1}º file: {file.title}</p>
      ))}

    </section>

  </main>)
}
