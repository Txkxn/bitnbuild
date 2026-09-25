import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IDIOMS_PATH = join(__dirname, "..", "data", "idioms.json");

let cachedIdioms = null;

async function loadIdioms() {
  if (cachedIdioms) return cachedIdioms;
  const raw = await readFile(IDIOMS_PATH, "utf-8");
  cachedIdioms = JSON.parse(raw);
  return cachedIdioms;
}

export async function findIdioms(text) {
  const idioms = await loadIdioms();
  const lower = text.toLowerCase();
  const matches = [];

  for (const [lang, entries] of Object.entries(idioms)) {
    for (const entry of entries) {
      if (lower.includes(entry.phrase.toLowerCase())) {
        matches.push({
          lang,
          phrase: entry.phrase,
          meaning: entry.meaning,
          context: entry.context,
        });
      }
    }
  }

  return matches;
}
