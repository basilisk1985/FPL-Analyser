export default async function handler(req, res) {
  try {
    const { gw_id } = req.query;

    if (!gw_id) {
      return res.status(400).json({ error: "Missing gw_id parameter" });
    }

    // Handle preflight (CORS)
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(200).end();
    }

    // Build the FPL API URL
    const targetUrl = `https://fantasy.premierleague.com/api/event/${gw_id}/live/`;

    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FPL API returned ${response.status}` });
    }

    const data = await response.json();

    // Add CORS + caching
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
}
