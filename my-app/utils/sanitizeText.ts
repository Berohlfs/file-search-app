type SanitizeOptions = {
    removeControlChars?: boolean
    collapseSpaces?: boolean
    collapseBlankLines?: boolean
    maxCodepoints?: number | null
}

export function sanitizeText(
    raw: string,
    opts: SanitizeOptions = {}
): string {
    const {
        removeControlChars = true,
        collapseSpaces = false,
        collapseBlankLines = false,
        maxCodepoints = null,
    } = opts

    let s = (raw ?? '').toString()

    if (typeof s.normalize === 'function') s = s.normalize('NFC')

    s = s.replace(/^\uFEFF/, '').replace(/\uFEFF/g, '')

    s = s.replace(/\r\n?/g, '\n')

    s = s.replace(/\u0000/g, '')

    if (removeControlChars) {
        s = s.replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u0080-\u009F]/g, ' ')
    }

    if (collapseSpaces) {
        s = s.replace(/[ \t\f\v]+/g, ' ')
    }

    if (collapseBlankLines) {
        s = s.replace(/\n{3,}/g, '\n\n')
    }

    s = s.trim()

    if (maxCodepoints && maxCodepoints > 0) {
        const cps = Array.from(s)
        if (cps.length > maxCodepoints) {
            s = cps.slice(0, maxCodepoints).join('')
        }
    }

    return s
}