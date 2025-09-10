export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timeout_id: NodeJS.Timeout | undefined

    return (...args: Parameters<T>): void => {
        if (timeout_id) {
            clearTimeout(timeout_id)
        }
        timeout_id = setTimeout(() => fn(...args), delay)
    }
}