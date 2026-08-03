export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const expectedToken = process.env.NTFY_RELAY_TOKEN || "";
  const auth = req.headers.authorization || "";
  if (!expectedToken || auth !== `Bearer ${expectedToken}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const topic = process.env.NTFY_TOPIC || "";
  const server = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(/\/+$/, "");
  const ntfyToken = process.env.NTFY_TOKEN || "";
  if (!topic) {
    res.status(500).json({ error: "ntfy_not_configured" });
    return;
  }

  const payload = typeof req.body === "object" && req.body ? req.body : {};
  const text = String(payload.body || "").slice(0, 2000);
  const title = String(payload.title || "Temperature alert").slice(0, 120);
  const priority = String(payload.priority || "default").slice(0, 20);
  const tags = String(payload.tags || "warning,thermometer").slice(0, 80);

  const headers = { Title: title, Priority: priority, Tags: tags };
  if (ntfyToken) headers.Authorization = `Bearer ${ntfyToken}`;

  try {
    const response = await fetch(`${server}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers,
      body: text,
    });

    let providerId = "";
    try {
      const body = await response.json();
      providerId = typeof body?.id === "string" ? body.id : "";
    } catch {
      providerId = response.headers.get("x-message-id") || "";
    }

    res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      status: response.status,
      providerId,
    });
  } catch {
    res.status(502).json({ ok: false, status: 0 });
  }
}
