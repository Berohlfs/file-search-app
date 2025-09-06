'use client'

// React
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
// Libs
import { useDropzone, type Accept } from 'react-dropzone'

type Props = {
    onFile: (file: File) => void
    file: File | null,
    setFile: Dispatch<SetStateAction<File | null>>
}

export function Dropzone({ onFile, file, setFile }: Props) {

    const ACCEPT: Accept = {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/plain': ['.txt'],
    }
    const MAX_SIZE_BYTES = useMemo(() => Math.floor(4.5 * 1024 * 1024), [])

    const [error, setError] = useState<string | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDrop = useCallback((accepted: File[], rejections: any[]) => {
        setError(null)

        if (rejections?.length) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const reasons = rejections[0]?.errors?.map((e: any) => e.message).join(', ')
            setFile(null)
            setError(reasons || 'Invalid file')
            return
        }

        const f = accepted[0]
        if (!f) return

        setFile(f)
        onFile(f)
    }, [onFile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: ACCEPT,
        maxSize: MAX_SIZE_BYTES,
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
                aria-label="Upload a document (PDF, DOCX, or TXT — max 4.5 MB)"
            >
                <input {...getInputProps()} />

                {!file ? (
                    <div className="text-sm text-muted-foreground">
                        <div className="font-medium">Drag & drop your file</div>
                        <div className="opacity-70">or click to browse</div>
                        <div className="mt-1 text-xs opacity-60">Accepted: PDF, DOCX, TXT — up to 4.5 MB</div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        <div className="font-medium">{file.name}</div>
                        <div className="opacity-70">{sizeMB} MB</div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setFile(null)
                                setError(null)
                            }}
                            className="mt-2 text-xs text-muted-foreground underline"
                        >
                            Remove file
                        </button>
                    </div>
                )}

                {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
            </div>
        </div>
    )
}
