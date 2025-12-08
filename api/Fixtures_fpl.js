export default async function handler(req, res) {
  try {
    // Handle preflight (CORS)
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).end();
    }

    const response = await fetch("https://fantasy.premierleague.com/api/fixtures/", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FPL API returned ${response.status}` });
    }

    const data = await response.json();

    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Optional caching
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
}
