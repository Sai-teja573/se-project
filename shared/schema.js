import { z } from "zod";

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
