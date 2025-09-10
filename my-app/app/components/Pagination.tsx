'use client';

// Shadcn
import { Button } from "@/components/ui/button"
// Icons
import { ChevronLeft, ChevronRight } from "lucide-react"
// Next
import { useRouter, useSearchParams } from "next/navigation"

interface Props {
  current_page: number
  total_items: number
  items_per_page: number
}

export const PaginationControls = ({ current_page, total_items, items_per_page }: Props) => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const paginate = (to_page: number) => {
    const current_params = new URLSearchParams(searchParams.toString())

    current_params.set('page', String(to_page))

    router.push(`?${current_params.toString()}`)
  }

  const total_pages = Math.ceil(total_items / items_per_page)

  return (
    <div className={'mt-4 pr-3 flex items-center gap-3 justify-end'}>
      {current_page > 1 && (
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => paginate(current_page - 1)}>
          <ChevronLeft />
        </Button>
      )}

      <div>
        <p className={'text-sm font-bold text-center'}>Page {current_page} / {total_pages}</p>
        <p className={'text-muted-foreground text-xs text-center'}>({total_items} total items)</p>
      </div>
      
      {current_page < total_pages && (
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => paginate(current_page + 1)}>
          <ChevronRight />
        </Button>
      )}
    </div>
  )
}