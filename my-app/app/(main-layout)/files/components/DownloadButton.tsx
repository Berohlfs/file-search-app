'use client'

// Shadcn
import { Button } from "@/components/ui/button"
// Icons
import { Download } from "lucide-react"
// React
import { useState } from "react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"

type Props = {
    token: string
    filename: string
}

export const DownloadButton = ({ token, filename }: Props) => {

    const [downloading, setDownloading] = useState(false)

    async function download() {
        setDownloading(true)
        try {
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
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Button
            onClick={download}
            size={'icon'}
            disabled={downloading}
            variant={'ghost'}>

            {downloading ? 
            <CircularProgress/> : 
            <Download />}

        </Button>
    )
}