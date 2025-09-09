// Next
import { Raleway } from "next/font/google"
import Link from "next/link"
// Shadcn
import { Button } from "@/components/ui/button"
// Components
import { ModeToggle } from "./components/ModeToggle"
// Icons
import { Files, Search } from "lucide-react"

const heading_font = Raleway({
  subsets: ["latin"],
})

export default async function Home() {

  return (<>
    <div className={'fixed top-5 right-5 z-10'}>
      <ModeToggle />
    </div>
    <section className={'fixed top-0 w-full h-full flex flex-col items-center justify-center px-5'}>

      <h1 className={`text-6xl sm:text-8xl font-medium text-center ${heading_font.className}`}>File Search</h1>

      <p className={'text-muted-foreground text-sm sm:text-xl text-center mt-2'}>Upload your documents and search<br /> inside their contents!</p>

      <nav className={'mt-4'}>
        <Link href={'/search'}>
          <Button variant={'link'}>Search <Search /></Button>
        </Link>
        <Link href={'/files'}>
          <Button variant={'link'}>All files <Files /></Button>
        </Link>
      </nav>

    </section>
  </>)
}
