import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");

function mustInclude(value, label = value) {
  if (!html.includes(value)) throw new Error(`missing ${label}`);
}

function mustNotInclude(value, label = value) {
  if (html.includes(value)) throw new Error(`unexpected ${label}`);
}

mustInclude("auth.signInWithPassword", "Supabase password sign-in");
mustInclude("auth.getSession", "session restore");
mustInclude('from("devices")', "V2 devices query");
mustInclude('from("temperature_readings")', "readings query");
mustInclude("fridge_temp", "V2 fridge column");
mustInclude("received_at", "V2 received timestamp");
mustInclude('from("alert_incidents")', "V2 incidents query");
mustInclude('functions.invoke("acknowledge-incident"', "acknowledgement Edge Function");
mustInclude('from("device_configuration")', "settings persistence");

mustNotInclude("device_configuration(*)", "wildcard configuration exposure");
mustNotInclude("storage_transform_mode", "internal transform mode exposure");
mustNotInclude("above_maximum_jitter_celsius", "internal transform jitter exposure");
mustNotInclude("ntfy_enabled", "internal ntfy flag exposure");
mustNotInclude("alert_state", "legacy alert_state table");
mustNotInclude("freezer_temp", "legacy freezer_temp column");
mustNotInclude("ambient_alert", "legacy ambient_alert column");
mustNotInclude("freezer_alert", "legacy freezer_alert column");
mustNotInclude("service_role", "service role marker");
mustNotInclude("SUPABASE_SERVICE", "service key env marker");

const key = html.match(/const SUPABASE_KEY = "([^"]+)";/)?.[1];
if (!key) throw new Error("Supabase client key constant not found");

const payloadPart = key.split(".")[1];
if (!payloadPart) throw new Error("Supabase client key is not a JWT-shaped publishable/anon key");
const payloadJson = Buffer.from(payloadPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
const payload = JSON.parse(payloadJson);
if (payload.role && payload.role !== "anon") {
  throw new Error("client key is not an anon/publishable key");
}

console.log("test ok");
