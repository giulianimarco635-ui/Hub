import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { type Catalog, type Episode, type YearCatalog, type MonthCatalog } from "@shared/schema";
import Parser from "rss-parser";

const FEED_URL = process.env.FEED_URL || "https://feeds.feedburner.com/Zoo105";

const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

// Helper to parse RSS and transform into our Catalog structure
async function parseFeed(): Promise<Catalog> {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);

  const catalog: Catalog = {
    audio: {},
    video: {}
  };

  for (const item of feed.items) {
    if (!item.pubDate || !item.enclosure) continue;

    const pubDate = new Date(item.pubDate);
    const year = pubDate.getFullYear();
    const monthIndex = pubDate.getMonth(); // 0-11
    const monthNum = monthIndex + 1;
    const monthName = MONTH_NAMES[monthIndex];

    const type = item.enclosure.type?.startsWith("video") ? "video" : "audio";
    
    // Create Episode object
    const episode: Episode = {
      id: item.guid || item.link || Math.random().toString(),
      title: item.title || "Senza titolo",
      description: item.contentSnippet || item.content || "",
      pubDate: item.pubDate,
      url: item.enclosure.url,
      type: type,
      duration: item.itunes?.duration, // Optional
      thumbnail: item.itunes?.image, // Optional
      year,
      month: monthNum,
      monthName
    };

    // Initialize structure if missing
    const targetSection = catalog[type];
    
    if (!targetSection[year]) {
      targetSection[year] = { year, months: {} };
    }
    
    if (!targetSection[year].months[monthNum]) {
      targetSection[year].months[monthNum] = {
        month: monthNum,
        monthName,
        episodes: []
      };
    }

    targetSection[year].months[monthNum].episodes.push(episode);
  }

  // Sort episodes by date (newest first) - usually feed is already sorted but good to ensure
  // Note: Object keys iteration order for years/months needs to be handled in frontend or we can use arrays. 
  // The schema uses records for easy lookup, frontend should `Object.values()` and sort.

  return catalog;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.feed.get.path, async (req, res) => {
    try {
      const catalog = await parseFeed();
      res.json(catalog);
    } catch (error) {
      console.error("Error fetching feed:", error);
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  app.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });

  return httpServer;
}
