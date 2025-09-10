'use client'

// Shadcn
import { Button } from "@/components/ui/button"
// Icons
import { Zap } from "lucide-react"
// React
import { useTransition } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
// Actions
import { embedFile } from "./actions/embedFile"
// Libs
import { toast } from "sonner"

type Props = {
    token: string
}

export const EmbedButton = ({ token }: Props) => {

    const [pending, startTransition] = useTransition()

    const embedFileCallback = () => {
        startTransition(() => {
            embedFile(token).then(res => {
                if (res) {
                    toast.warning(res)
                }
            })
        })
    }

    return (
        <Button
            onClick={embedFileCallback}
            size={'sm'}
            disabled={pending}
            variant={'ghost'}>

            {pending ?
                <>
                    Embedding
                    <CircularProgress color={'auto'} />
                </>
                :
                <>
                    Embed
                    <Zap />
                </>}
        </Button>
    )
}