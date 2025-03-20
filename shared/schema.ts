import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diagrams = pgTable("diagrams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  elements: jsonb("elements").notNull(),
  dataDictionary: jsonb("data_dictionary").notNull(),
});

export const ElementSchema = z.object({
  id: z.string(),
  type: z.enum(["bubble", "entity", "datastore"]),
  x: z.number(),
  y: z.number(),
  text: z.string(),
});

export const ConnectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: z.enum(["arrow"]),
});

export const DataDictionaryEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const DiagramDataSchema = z.object({
  elements: z.array(ElementSchema),
  connections: z.array(ConnectionSchema),
  dataDictionary: z.array(DataDictionaryEntrySchema),
});

export const insertDiagramSchema = createInsertSchema(diagrams);

export type InsertDiagram = z.infer<typeof insertDiagramSchema>;
export type Diagram = typeof diagrams.$inferSelect;
export type Element = z.infer<typeof ElementSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type DataDictionaryEntry = z.infer<typeof DataDictionaryEntrySchema>;
