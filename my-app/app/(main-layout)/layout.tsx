// Icons
import { FileSearch, Files, Search } from "lucide-react"
// Next
import Link from "next/link"
// Shadcn
import { Button } from "@/components/ui/button"

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
                <nav>
                    <Link href={'/search'}>
                        <Button
                            variant={'link'}
                            size={'sm'}>
                            Search <Search />
                        </Button>
                    </Link>
                    <Link href={'/files'}>
                        <Button
                            variant={'link'}
                            size={'sm'}>
                            All files <Files />
                        </Button>
                    </Link>
                </nav>
            </header>
            <main className={'max-w-[1000px] mx-auto px-3'}>
                {children}
            </main>
        </>
    )
}
