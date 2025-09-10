'use client'

// Components
import { Dropzone } from "./Dropzone"
// Libs
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
// Validation
import { upload_form_validation, upload_form_default_values } from "@/validation/uploadFile"
// Shadcn
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// Icons
import { AlertCircle, Upload } from "lucide-react"
// Actions
import { uploadFile } from "./actions/uploadFile"
// React
import { useRef, useState, useTransition } from "react"

export const UploadForm = () => {

    const form = useForm<z.infer<typeof upload_form_validation>>({
        resolver: zodResolver(upload_form_validation),
        defaultValues: upload_form_default_values
    })

    const formRef = useRef<HTMLFormElement>(null)

    const [file, setFile] = useState<File | null>(null)

    const [pending, startTransition] = useTransition()

    async function onSubmit() {

        const formEl = formRef.current

        if (!formEl) {
            return
        }
        const fd = new FormData(formEl)

        if (file) {
            const ab = await file.arrayBuffer()

            // Avoids ERR_UPLOAD_FILE_CHANGED (ex: Google Drive files on Android)
            const stable = new File([ab], file.name, {
                type: file.type || 'application/octet-stream',
                lastModified: Date.now(),
            })
            fd.set('file', stable, stable.name)
        } else {
            return toast.warning('Please, select a file.')
        }

        startTransition(() => {
            uploadFile(fd).then(res => {
                if (res) {
                    toast.warning(res)
                } else {
                    toast.success('Upload successful!')
                    setFile(null)
                    form.reset()
                }
            })
        })
    }

    return (<>
        <div className={'flex flex-col gap-4'}>

            <Dropzone
                file={file}
                setFile={setFile} />

            <Form {...form}>
                <form
                    ref={formRef}
                    className="space-y-4"
                    onSubmit={form.handleSubmit(() => onSubmit())} >

                    <div className={'flex gap-2'}>
                        <FormField
                            control={form.control}
                            name={'title'}
                            render={({ field }) => (
                                <FormItem className={'flex-1 '}>
                                    <FormLabel>File Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Type the title here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className={'mt-[22px]'}
                            disabled={pending}
                            type="submit">
                            {pending ?
                                <>
                                    Uploading...
                                </> :
                                <>
                                    Upload <Upload />
                                </>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
        <div className={'flex flex-col gap-2 items-center mt-12'}>
            <p className={'text-muted-foreground text-xs text-center'}>
                This tool extracts text <span className={'font-bold'}>directly from the PDF</span>. <br />
                If your file is a scanned document or image-only PDF, the text <span className={'font-bold'}>may not appear</span>.
            </p>
            <AlertCircle size={16} />
        </div>
    </>)
}