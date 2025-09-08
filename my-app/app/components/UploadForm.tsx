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
import { Upload } from "lucide-react"
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

    const [file_ui_reset_switch, setFileUIResetSwitch] = useState(false)

    const [pending, startTransition] = useTransition()

    async function onSubmit() {

        const formEl = formRef.current

        if(!formEl){
            return 
        }

        const fd = new FormData(formEl)

        const input = formEl.querySelector<HTMLInputElement>('input[name="file"]')
        const file = input?.files?.[0]

        // Avoids ERR_UPLOAD_FILE_CHANGED (ex: Google Drive files on Android)
        if (file) {
            const ab = await file.arrayBuffer()
            const stable = new File([ab], file.name, {
                type: file.type || 'application/octet-stream',
                lastModified: Date.now(),
            })
            fd.set('file', stable, stable.name)
        }

        startTransition(() => {
            uploadFile(fd).then(res => {
                if (res) {
                    toast.warning(res)
                } else {
                    setFileUIResetSwitch(prev => !prev)
                    form.reset()
                }
            })
        })
    }

    return (
        <div className={'flex flex-col gap-4'}>
            <Form {...form}>
                <form
                    ref={formRef}
                    className="space-y-4"
                    onSubmit={form.handleSubmit(()=> onSubmit())} >

                    <Dropzone
                        file_ui_reset_switch={file_ui_reset_switch} />

                    <FormField
                        control={form.control}
                        name={'title'}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>File Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Type the title here" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
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
                </form>
            </Form>
        </div>
    )
}