export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.json({ summary: "Please enter email text" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Summarize this email into ONE clean paragraph.

Rules:
- No "Here is summary"
- No bullet points
- Keep it short and clean

Email:
${email}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let summary = raw
      .replace(/here is.*?:/i, "")
      .replace(/here's.*?:/i, "")
      .replace(/\*/g, "")
      .replace(/\n+/g, " ")
      .trim();

    res.status(200).json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ summary: "Something went wrong" });
  }
}