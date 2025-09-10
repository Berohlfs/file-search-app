// Icons
import { FileSearch, Files, Search } from "lucide-react"
// Next
import Link from "next/link"
// Shadcn
import { Button } from "@/components/ui/button"
// Components
import { ModeToggle } from "../components/ModeToggle"

type Props = {
    children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
        <>
            <header className={'max-w-[1000px] mx-auto border-b p-4 flex justify-between items-center'}>
                <Link href={'/'}>
                    <div className={'flex items-center gap-2'}>
                        <FileSearch size={18} />
                        <h1 className={'font-medium'}>File Search</h1>
                    </div>
                </Link>
                <nav className={'flex items-center'}>
                    <Link href={'/search'}>
                        <Button
                            variant={'link'}
                            size={'sm'}>
                            Search <Search className={'hidden sm:block'}/>
                        </Button>
                    </Link>
                    <Link href={'/files'} className={'mr-5'}>
                        <Button
                            variant={'link'}
                            size={'sm'}>
                            All files <Files className={'hidden sm:block'}/>
                        </Button>
                    </Link>
                    <ModeToggle />
                </nav>
            </header>
            <main className={'max-w-[1000px] mx-auto px-3'}>
                {children}
            </main>
        </>
    )
}
