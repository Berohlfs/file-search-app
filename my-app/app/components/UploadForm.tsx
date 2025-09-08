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
import { useActionState, useEffect, useRef, useState } from "react"

export const UploadForm = () => {

    const form = useForm<z.infer<typeof upload_form_validation>>({
        resolver: zodResolver(upload_form_validation),
        defaultValues: upload_form_default_values
    })

    const formRef = useRef<HTMLFormElement>(null)

    const [response_state, action, pending] = useActionState(uploadFile, null)

    const [file_ui_reset_switch, setFileUIResetSwitch] = useState(false)

    useEffect(() => {
        if (response_state && !pending) {
            if (response_state === 'File uploaded!') {
                toast.success(response_state)
                formRef.current?.reset()
                form.reset()
                setFileUIResetSwitch(prev => !prev)
            } else {
                toast.warning(response_state)
            }
        }
    }, [response_state, pending])

    return (
        <div className={'flex flex-col gap-4'}>
            <Form {...form}>
                <form
                    ref={formRef}
                    className="space-y-4"
                    action={action}>

                    <Dropzone file_ui_reset_switch={file_ui_reset_switch} />

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
                        type="button"
                        onClick={form.handleSubmit(() => formRef.current?.requestSubmit())}
                        disabled={pending}>
                        {pending ? 'Uploading…' : <>Upload <Upload /></>}
                    </Button>
                </form>
            </Form>
        </div>
    )
}