// Screenshot each stills/scene-N.html at 1080x1920 with headless Chrome.
import { createServer } from "node:http";
import { readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "renders", "stills");
mkdirSync(outDir, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let p = join(root, url.replace(/^\//, "") || "index.html");
  if (!p.startsWith(root)) { res.writeHead(403); res.end(); return; }
  if (!existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end("not found " + url); return; }
  res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream", "Cache-Control": "no-store" });
  res.end(readFileSync(p));
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const chrome = "/usr/bin/google-chrome-stable";

async function shot(id) {
  const dest = join(outDir, `${id}.png`);
  const url = `http://127.0.0.1:${port}/stills/${id}.html`;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--default-background-color=FF0C0806",
    "--font-render-hinting=none",
    "--virtual-time-budget=8000",
    "--run-all-compositor-stages-before-draw",
    `--window-size=1080,1920`,
    `--screenshot=${dest}`,
    url,
  ];
  await new Promise((resolve, reject) => {
    const p = spawn(chrome, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => { err += d; });
    p.on("exit", (code) => code === 0 ? resolve() : reject(new Error(err || "chrome " + code)));
  });
  const st = statSync(dest);
  console.log("shot", id, st.size, "bytes");
}

for (let i = 0; i < 8; i++) await shot(`scene-${i}`);
server.close();
console.log("done", outDir);
