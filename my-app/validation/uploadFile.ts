import z from 'zod'

export const upload_form_validation = z.object({
    title: z.string().min(5, 'Type a title with at least 5 characters.').max(50, "File title too long.")
})

export const upload_form_default_values = {
    title: ''
}