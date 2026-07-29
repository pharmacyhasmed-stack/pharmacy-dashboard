import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const script = html.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/)?.[1];

if (!script) throw new Error("inline dashboard script not found");
new Function(script);

const requiredIds = [
  "authCard",
  "btnSignIn",
  "btnSignOut",
  "btnAck",
  "deviceName",
  "incidentState",
  "btnSaveSettings",
  "ambientMin",
  "fridgeMax",
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) throw new Error(`missing required element #${id}`);
}

console.log("lint ok");
