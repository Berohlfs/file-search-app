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
import { useState, useTransition } from "react"

export const UploadForm = () => {

    const form = useForm<z.infer<typeof upload_form_validation>>({
        resolver: zodResolver(upload_form_validation),
        defaultValues: upload_form_default_values
    })

    const [file, setFile] = useState<File | null>(null)

    const [pending, startTransition] = useTransition()

    function onSubmit(data: z.infer<typeof upload_form_validation>) {
        if (!file) {
            toast.warning('Please, select a file.')
        } else {
            startTransition(() => {
                uploadFile(data, file).then(res => {
                    if (res) {
                        toast.warning(res)
                    } else {
                        setFile(null)
                        form.reset()
                    }
                })
            })
        }
    }

    return (
        <div className={'flex flex-col gap-4'}>
            <Dropzone
                file={file}
                setFile={setFile}
                onFile={(file) => setFile(file)} />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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