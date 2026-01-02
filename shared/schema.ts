import { z } from "zod";

// Data models for the parsed feed
export const episodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  pubDate: z.string(),
  url: z.string(),
  type: z.enum(["audio", "video"]),
  duration: z.string().optional(),
  thumbnail: z.string().optional(),
  year: z.number(),
  month: z.number(), // 1-12
  monthName: z.string(),
});

export type Episode = z.infer<typeof episodeSchema>;

export const monthCatalogSchema = z.object({
  month: z.number(),
  monthName: z.string(),
  episodes: z.array(episodeSchema),
});

export type MonthCatalog = z.infer<typeof monthCatalogSchema>;

export const yearCatalogSchema = z.object({
  year: z.number(),
  months: z.record(z.string(), monthCatalogSchema), // Key is month number string "1"-"12"
});

export type YearCatalog = z.infer<typeof yearCatalogSchema>;

export const catalogSchema = z.object({
  audio: z.record(z.string(), yearCatalogSchema), // Key is year string
  video: z.record(z.string(), yearCatalogSchema), // Key is year string
});

export type Catalog = z.infer<typeof catalogSchema>;
