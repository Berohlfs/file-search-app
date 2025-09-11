// Shadcn
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {

    const cn_container = 'grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[calc(100vh-240px)] overflow-y-scroll px-2 mb-3'

    return (
        <section className={'mt-4'}>
            <div className={cn_container}>

                <Skeleton className={'h-9 w-full'} />
                <Skeleton className={'h-9 w-full'} />

            </div>
            <div className={cn_container}>

                <Skeleton className={'h-38 w-full'} />
                <Skeleton className={'h-38 w-full'} />
                <Skeleton className={'h-38 w-full'} />
                <Skeleton className={'h-38 w-full'} />
                <Skeleton className={'h-38 w-full'} />
                <Skeleton className={'h-38 w-full'} />

            </div>
        </section>)
}