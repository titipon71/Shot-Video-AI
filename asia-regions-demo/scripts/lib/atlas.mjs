// Country shapes from world-atlas (Natural Earth 110m), cached locally after the first fetch.
// The bake page loads the same file, so names and shapes match what gets drawn.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { feature } from "topojson-client";

const URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
const MARGIN = [16, 13]; // same keep-box the bake uses around each country's mainland

export async function loadAtlas(root) {
  const dir = join(root, ".cache");
  const file = join(dir, "countries-110m.json");
  if (!existsSync(file)) {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`world-atlas fetch failed: ${res.status}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, await res.text());
  }
  const topo = JSON.parse(readFileSync(file, "utf8"));
  const byName = new Map();
  for (const f of feature(topo, topo.objects.countries).features) byName.set(f.properties.name, f);
  return byName;
}

const ringCentroid = (r) => [r.reduce((s, c) => s + c[0], 0) / r.length, r.reduce((s, c) => s + c[1], 0) / r.length];

// Outer rings of the country's mainland and nearby islands, lon unwrapped around the mainland
// (drops far territories like French Guiana, as the bake does).
function mainlandRings(f) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const anchor = polys.reduce((a, p) => (p[0].length > a[0].length ? p : a));
  const [ax, ay] = ringCentroid(anchor[0]);
  const unwrap = (lon) => {
    while (lon - ax > 180) lon -= 360;
    while (lon - ax < -180) lon += 360;
    return lon;
  };
  return polys
    .map((p) => p[0].map(([lon, lat]) => [unwrap(lon), lat]))
    .filter((r) => {
      const [cx, cy] = ringCentroid(r);
      return Math.abs(cx - ax) <= MARGIN[0] && Math.abs(cy - ay) <= MARGIN[1];
    });
}

// Lon/lat box around the given countries' mainlands, for framing. Points past 72° are left out:
// polar islands (Svalbard, Franz Josef Land) stretch huge in Mercator and would pull the camera out.
export function boundsOf(atlas, names) {
  const pts = names.flatMap((n) => mainlandRings(atlas.get(n)).flat()).filter(([, lat]) => Math.abs(lat) <= 72);
  // Unwrap every point around the first one so a group spanning the antimeridian stays contiguous.
  const ref = pts[0][0];
  const lons = pts.map(([lon]) => {
    while (lon - ref > 180) lon -= 360;
    while (lon - ref < -180) lon += 360;
    return lon;
  });
  const lats = pts.map((p) => p[1]);
  return { west: Math.min(...lons), east: Math.max(...lons), south: Math.min(...lats), north: Math.max(...lats) };
}

// Names close to a missing one, to suggest in the error.
export function suggest(atlas, name) {
  const q = name.toLowerCase().replace(/[^a-z]/g, "");
  return [...atlas.keys()].filter((n) => {
    const k = n.toLowerCase().replace(/[^a-z]/g, "");
    return k.includes(q.slice(0, 4)) || q.includes(k.slice(0, 4));
  });
}
