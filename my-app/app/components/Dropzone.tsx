'use client'

// Shadcn
import { Badge } from '@/components/ui/badge'
// React
import { useEffect, useState } from 'react'
// Libs
import { useDropzone, type Accept } from 'react-dropzone'

type Props = {
    file_ui_reset_switch?: boolean
}

export function Dropzone({ file_ui_reset_switch }: Props) {

    const ACCEPT: Accept = {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
    }

    const [file, setFile] = useState<File | null>(null)

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setFile(null)
    }, [file_ui_reset_switch])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDrop = (files: File[], rejections: any[]) => {
        setError(null)

        if (rejections?.length) {
            const reasons = rejections[0]?.errors?.map((e: { message: string }) => e.message).join(', ')
            setError(reasons || 'Invalid file')
            return
        }

        const f = files[0]
        setFile(f)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: ACCEPT,
        maxSize: Math.floor(4 * 1024 * 1024), // 4 MB
        onDrop,
    })

    const sizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={[
                    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition',
                    isDragActive ? 'border-blue-400 bg-blue-400/10' : 'border-accent-foreground/30 hover:border-accent-foreground/50',
                ].join(' ')}
                aria-label="Upload a document (PDF or TXT — max 4.5 MB)"
            >
                <input {...getInputProps()} name={'file'} required />

                <div className="text-muted-foreground">
                    <div className="font-bold text-sm">Drag & drop your file</div>
                    <div className={'text-xs mb-8'}>or click to browse</div>
                    <div className={'text-xs'}>PDF or TXT — up to 4 MB</div>
                </div>

                {file &&
                    <div className="flex gap-1 items-center">
                        <Badge>
                            {file.name}
                        </Badge>
                        <Badge variant={'outline'}>
                            {sizeMB} MB
                        </Badge>
                    </div>}

                {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
            </div>
        </div>
    )
}
