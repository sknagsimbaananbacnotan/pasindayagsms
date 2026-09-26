export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.SEMAPHORE_API_KEY;
  const senderName = process.env.SEMAPHORE_SENDER_NAME;

  if (!apiKey) {
    return res.status(500).json({ error: "SEMAPHORE_API_KEY is not configured in Vercel." });
  }

  const { number, message } = req.body || {};
  if (!number || !message) {
    return res.status(400).json({ error: "Mobile number and message are required." });
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    number: String(number).trim(),
    message: String(message).trim()
  });

  if (senderName && senderName.trim()) {
    params.append("sendername", senderName.trim());
  }

  try {
    const response = await fetch("https://api.semaphore.co/api/v4/messages", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }

    if (!response.ok) {
      return res.status(response.status).json({ error: "Semaphore rejected the request.", details: data });
    }

    if (Array.isArray(data) && data.some(x => String(x.status || "").toLowerCase() === "failed")) {
      return res.status(502).json({ error: "Semaphore returned a failed message status.", details: data });
    }

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return res.status(500).json({ error: "Unable to connect to Semaphore.", details: error.message });
  }
}