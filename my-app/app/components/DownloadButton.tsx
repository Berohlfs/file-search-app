'use client'

// Shadcn
import { Button } from "@/components/ui/button"
// Icons
import { Download } from "lucide-react"

type Props = {
    token: string
    filename: string
}

export const DownloadButton = ({ token, filename }: Props) => {

    async function download() {
        const res = await fetch(`/api/download/${encodeURIComponent(token)}`)
        if (!res.ok) {
            return
        }
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <Button onClick={download} size={'icon'} variant={'ghost'}>
            <Download />
        </Button>
    )
}