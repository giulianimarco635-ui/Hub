// Storage interface not strictly needed for RSS proxy but keeping for structure consistency
// and potential future caching.
import { type Catalog } from "@shared/schema";

export interface IStorage {
  // We don't persist the feed in DB for this version, we parse it on demand or cache in memory
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
