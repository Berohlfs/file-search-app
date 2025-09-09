// Drizzle
import { sql } from "drizzle-orm"
import { pgTable, varchar, timestamp, serial, uuid, integer, text } from "drizzle-orm/pg-core"

export const files = pgTable("files", {
    id: serial().primaryKey().notNull(),
    token: uuid().default(sql`gen_random_uuid()`).unique().notNull(),

    title: varchar({ length: 255 }).notNull(),
    extension: varchar({ length: 10 }).notNull(),
    size: integer().notNull(),

    mime_type: text().notNull(),
    content_text: text().notNull(),
    char_count: integer().notNull(),

    bucket_ref: uuid().notNull(),

    created_at: timestamp({ withTimezone: true }).defaultNow().notNull()
})