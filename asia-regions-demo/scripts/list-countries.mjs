// Print the country names a config may use (exact spelling): node scripts/list-countries.mjs [filter]
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadAtlas } from "./lib/atlas.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const q = (process.argv[2] ?? "").toLowerCase();
const names = [...(await loadAtlas(root)).keys()].filter((n) => n.toLowerCase().includes(q)).sort();
console.log(names.join("\n"));
console.log(`\n${names.length} countries`);
