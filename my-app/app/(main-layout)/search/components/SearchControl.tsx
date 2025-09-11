'use client'

// Shadcn
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
// Next
import { useRouter, useSearchParams } from "next/navigation"
// React
import { useCallback, useEffect, useState, useTransition } from "react"
// Utils
import { debounce } from "@/utils/debounce"
// Components
import { CircularProgress } from "@/app/components/CircularProgress"
// Icons
import { Info } from "lucide-react"

type Props = {
    children: React.ReactNode
}

export const SearchControl = ({ children }: Props) => {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [search_value, setSearchValue] = useState<string>('')

    const [semantic_search_on, setSemanticSearchOn] = useState<boolean>(false)

    const [pending, startTransition] = useTransition()

    const debouncedSearch = useCallback(debounce((search: string) => {
        const current_params = new URLSearchParams(searchParams.toString())
        const filter = () => router.push(`?${current_params.toString()}`)

        if ((search && search.length > 3) || !search) {
            startTransition(() => {
                if (search && search.length > 3) {
                    current_params.set('q', search)
                } else if (!search) {
                    current_params.delete('q')
                }
                filter()
            })
        }

    }, 1000), [searchParams])

    const toggleSemanticSwitch = (semantic: boolean) => {
        startTransition(() => {
            const current_params = new URLSearchParams(searchParams.toString())
            if (semantic) {
                current_params.set('semantic', 'on')
            } else {
                current_params.delete('semantic')
            }
            router.push(`?${current_params.toString()}`)
        })
    }

    // Syncs inputs to URL on load
    useEffect(() => {
        const current_params = new URLSearchParams(searchParams.toString())

        if (current_params.has('q')) {
            setSearchValue(current_params.get('q') || '')
        }
        if (current_params.has('semantic') && current_params.get('semantic') === 'on') {
            setSemanticSearchOn(true)
        }
    }, [])

    return (<>
        <div className={'flex flex-col gap-2 mb-3'}>
            <div className={'ml-2 flex items-center justify-between gap-2'}>
                <Label htmlFor="q">Search Contents</Label>

                <div className="flex items-center space-x-2">
                    <Label htmlFor="semantic" className={'text-xs font-normal'}>Semantic Search</Label>
                    <Switch
                        onCheckedChange={(bool) => { setSemanticSearchOn(bool); toggleSemanticSwitch(bool) }}
                        checked={semantic_search_on}
                        id="semantic" />
                </div>
            </div>

            <Input
                id={'q'}
                value={search_value}
                onChange={(e) => { setSearchValue(e.target.value); debouncedSearch(e.target.value) }}
                placeholder={'Search by keywords, sentences, etc. At least 4 characters.'}
                className={'h-14'} />
        </div>

        {pending
            ?
            <div className={'h-40 flex flex-col gap-2 justify-center items-center'}>
                <CircularProgress />
                <p className={'text-muted-foreground text-sm'}>Searching...</p>
            </div>
            :
            children}

        <div className="flex flex-col items-center gap-3 mt-6">
            <Info size={16} aria-label="How search works" />
            <p className="text-muted-foreground text-xs text-center">
                <strong>Semantic search</strong> turns your query into a vector and compares it to
                vectors of small text chunks from every file using <code>pgvector</code>.
                All vector embeddings are generated with OpenAI’s <em>text-embedding-3-small</em> model.
            </p>
            <p className="text-muted-foreground text-xs text-center">
                <strong>Traditional search</strong> matches your query against contents from every file using <code>ILIKE</code>.
            </p>
        </div>
    </>)
}