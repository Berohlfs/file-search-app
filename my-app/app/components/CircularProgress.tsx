type Props = {
    size?: number
    className?: string
    dark?: true
}

export const CircularProgress = ({ size = 20, className = "", dark }: Props) => {
    return (
        <div
            className={`animate-spin rounded-full border-4 border-t-transparent ${dark ? 'border-foreground' : 'border-background'} ${className}`}
            style={{ width: size, height: size }}
        />
    )
}