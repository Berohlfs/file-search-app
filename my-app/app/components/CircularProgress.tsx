type Props = {
    size?: number
    color?: 'auto' | 'dark' | 'light'
}

export const CircularProgress = ({ size = 20, color = 'auto' }: Props) => {

    let border = 'border-foreground'

    if(color === 'dark'){
        border =  'border-foreground dark:border-background'
    }else if(color === 'light'){
        border =  'border-background dark:border-foreground'
    }

    return (
        <div
            className={`animate-spin rounded-full border-4 ${border} border-t-transparent dark:border-t-transparent`}
            style={{ width: size, height: size }}
        />
    )
}