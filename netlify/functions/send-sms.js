exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const apiKey = process.env.SEMAPHORE_API_KEY;
    const senderName = process.env.SEMAPHORE_SENDER_NAME || "";
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "SEMAPHORE_API_KEY is not configured in Netlify." }) };
    }

    const { recipients, messages } = JSON.parse(event.body || "{}");
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No recipients supplied." }) };
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No messages supplied." }) };
    }

    const numbers = [...new Set(recipients.map(r => String(r.number || "").trim()).filter(Boolean))];
    if (numbers.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Recipients do not have valid phone numbers." }) };
    }
    if (numbers.length > 1000) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Semaphore allows up to 1,000 recipients per bulk request." }) };
    }

    const results = [];
    for (const rawMessage of messages) {
      const message = String(rawMessage || "").trim();
      if (!message) continue;

      const form = new URLSearchParams();
      form.set("apikey", apiKey);
      form.set("number", numbers.join(","));
      form.set("message", message);
      if (senderName) form.set("sendername", senderName);

      const response = await fetch("https://api.semaphore.co/api/v4/messages", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString()
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      results.push({ ok: response.ok, status: response.status, response: data });

      if (!response.ok) {
        return { statusCode: 502, headers, body: JSON.stringify({ error: "Semaphore rejected the SMS request.", details: data }) };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, recipients: numbers.length, messageParts: results.length, results }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || "Unexpected server error" }) };
  }
};
