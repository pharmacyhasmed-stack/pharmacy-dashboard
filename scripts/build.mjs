import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const out = "dist";
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of ["index.html", "manifest.json", "sw.js", "icon-192.png", "icon-512.png"]) {
  await cp(file, join(out, file));
}

console.log("build ok: dist");
