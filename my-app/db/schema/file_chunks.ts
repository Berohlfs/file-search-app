// Drizzle
import { sql } from "drizzle-orm"
import { pgTable, timestamp, serial, uuid, integer, text, vector } from "drizzle-orm/pg-core"
import { files } from './files'

export const file_chunks = pgTable("file_chunks", {
    id: serial().primaryKey().notNull(),
    token: uuid().default(sql`gen_random_uuid()`).unique().notNull(),

    content_text: text().notNull(),
    char_count: integer().notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    position: integer().notNull(),

    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),

    file_id: integer().notNull().references(() => files.id, { onDelete: 'cascade' })
})