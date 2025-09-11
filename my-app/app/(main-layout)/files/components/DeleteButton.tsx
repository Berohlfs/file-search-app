'use client'

// Shadcn
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// Icons
import { Trash, X } from "lucide-react"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
// React
import { useTransition } from "react"
// Actions
import { deleteFile } from "./actions/deleteFile"
// Libs
import { toast } from "sonner"

type Props = {
    token: string
    filename: string
}

export const DeleteButton = ({ token, filename }: Props) => {

    const [pending, startTransition] = useTransition()

    const deleteFileCallback = () => {
        startTransition(() => {
            deleteFile(token).then(res => {
                if (res) {
                    toast.warning(res)
                }
            })
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={'icon'}
                    variant={'ghost'}>
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete File</DialogTitle>
                </DialogHeader>

                <p className={'text-xs font-medium text-center italic my-5 truncate min-w-0'}>{filename}</p>

                <p className={'text-sm'}>
                    Are you sure? This action is {' '}
                    <span className={'text-destructive font-medium.'}>irreversible</span>.
                </p>

                <DialogFooter className={'flex-row justify-end'}>
                    <DialogClose asChild>
                        <Button
                            size={'sm'}
                            variant="outline">
                            Cancel <X />
                        </Button>
                    </DialogClose>
                    <Button
                        size={'sm'}
                        type="button"
                        disabled={pending}
                        variant={'destructive'}
                        onClick={deleteFileCallback}>
                        {pending ?
                            <>
                                Deleting
                                <CircularProgress color={'light'} />
                            </>
                            :
                            <>
                                Delete
                                <Trash />
                            </>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}