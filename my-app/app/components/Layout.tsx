// Components
import { ModeToggle } from "@/app/components/ModeToggle"

type Props = {
    children: React.ReactNode
}

export const Layout = ({ children }: Props) => {
    return (<>
        <header className={'mx-auto max-w-[800px] flex justify-between items-center p-5 bg-gradient-to-r from-accent to-accent/60 rounded-lg mt-5'}>
            <h1 className={'text-center text-xl font-bold'}>FILE SEARCH APP</h1>
            <ModeToggle />
        </header>
        <main className={'mx-auto max-w-[800px]'}>
            {children}
        </main>
    </>)
}