// Drizzle
import { sql } from "drizzle-orm"
import { pgTable, timestamp, serial, uuid, integer, text, customType } from "drizzle-orm/pg-core"
import { files } from './files'

// Factory for pgvector columns (e.g., vector(1536))
const vector = (dim: number) =>
    customType<{ data: number[]; driverData: number[] }>({
        dataType() {
            return `vector(${dim})`
        },
        toDriver: (value) => value,
        fromDriver: (value) => value as number[],
    })

export const file_chunks = pgTable("file_chunks", {
    id: serial().primaryKey().notNull(),
    token: uuid().default(sql`gen_random_uuid()`).unique().notNull(),

    content_text: text().notNull(),
    char_count: integer().notNull(),
    embedding: vector(1536)("embedding").notNull(),

    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),

    file_id: integer().notNull().references(() => files.id, { onDelete: 'cascade' })
})