import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ============================
   🔁 Retry Function (handles 503)
============================ */
async function summarizeWithRetry(email, retries = 3) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `
Summarize the following email into ONE clean paragraph.

Rules:
- Do NOT write "Here is a summary"
- Do NOT use bullet points
- Do NOT add headings
- Keep it concise and clear
- Focus only on important information (jobs, salary, offers)

Email:
${email}
`,
                            },
                        ],
                    },
                ],
            }
        );

        console.log("🧠 API RESPONSE RECEIVED");

        let raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // clean unwanted phrases
        let summary = raw
            .replace(/here is.*?:/i, "")
            .replace(/here's.*?:/i, "")
            .replace(/\*/g, "") // remove *
            .replace(/\n+/g, " ") // remove line breaks
            .trim();

        return summary;

    } catch (error) {

        console.log("🔥 FULL ERROR:", error.response?.data || error.message);

        // 🔁 Retry only for 503
        if (retries > 0 && error.response?.status === 503) {
            console.log("🔁 Retrying...");
            await new Promise((res) => setTimeout(res, 1500));
            return summarizeWithRetry(email, retries - 1);
        }

        // ✅ FALLBACK (IMPORTANT)
        console.log("⚠️ Using fallback summary");

        let fallback = email
            .split(" ")
            .slice(0, 40)
            .join(" ");

        return `• ${fallback}...`;
    }
}
/* ============================
   📩 API Route
============================ */
app.post("/summarize", async (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        return res.json({ summary: "Please enter email text" });
    }

    try {
        const summary = await summarizeWithRetry(email);

        res.json({
            summary: summary || "No summary generated",
        });

    } catch (error) {
        res.json({
            summary: "Server busy, please try again.",
        });
    }
});

/* ============================
   🚀 Start Server
============================ */
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});