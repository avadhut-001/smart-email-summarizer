import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = Number(process.env.PORT || 5000);
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanSummaryText(text) {
  return text
    .replace(/here is.*?:/gi, "")
    .replace(/here's.*?:/gi, "")
    .replace(/summary\s*:/gi, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function createLocalFallbackSummary(email) {
  const normalized = email.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Please enter email text.";
  }

  const sentences = splitSentences(normalized);

  if (sentences.length === 0) {
    return normalized.split(" ").slice(0, 45).join(" ");
  }

  const priorityPatterns = [
    /\b(interview|meeting|call|schedule|slot|deadline|offer|salary|compensation|role|position|job)\b/i,
    /\b(reply|respond|confirm|submit|share|send|join|attend|complete|review)\b/i,
    /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|date|time)\b/i,
  ];

  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;

    priorityPatterns.forEach((pattern, patternIndex) => {
      if (pattern.test(sentence)) {
        score += 4 - patternIndex;
      }
    });

    if (index === 0) {
      score += 1;
    }

    return { sentence, score, index };
  });

  const selected = scoredSentences
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence)
    .join(" ");

  return cleanSummaryText(selected || sentences[0]).slice(0, 420);
}

function buildPrompt(email) {
  return `
Summarize the following email into one clean paragraph.

Rules:
- Do not write "Here is a summary"
- Do not use bullet points
- Do not add headings
- Keep it concise and clear
- Focus on the most important actions, dates, offers, salary, or decisions

Email:
${email}
  `;
}

async function requestGeminiSummary(model, email) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: buildPrompt(email),
            },
          ],
        },
      ],
    },
    {
      timeout: 20000,
    }
  );

  const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanSummaryText(raw);
}

async function summarizeWithRetry(email) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const summary = await requestGeminiSummary(model, email);

        if (summary) {
          console.log(`Summary generated with ${model} on attempt ${attempt}`);
          return {
            summary,
            source: "ai",
            model,
          };
        }

        throw new Error("Empty summary returned from Gemini");
      } catch (error) {
        lastError = error;

        const status = error.response?.status;
        const details = error.response?.data || error.message;

        console.log(`Gemini request failed for ${model} on attempt ${attempt}:`, details);

        const retryable = status === 429 || status === 500 || status === 503;

        if (!retryable) {
          break;
        }

        if (attempt < 3) {
          const waitTime = 1200 * 2 ** (attempt - 1);
          console.log(`Retrying ${model} in ${waitTime}ms`);
          await sleep(waitTime);
        }
      }
    }
  }

  const fallbackSummary = createLocalFallbackSummary(email);

  console.log("Using local fallback summary after Gemini retries were exhausted");

  return {
    summary: fallbackSummary,
    source: "fallback",
    model: null,
    warning:
      "AI service is temporarily busy, so this summary was generated locally from the email text.",
    lastError:
      lastError?.response?.data?.error?.message || lastError?.message || "Unknown error",
  };
}

app.post("/summarize", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      summary: "",
      source: "none",
      error: "Please enter email text.",
    });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      summary: createLocalFallbackSummary(email),
      source: "fallback",
      warning:
        "GEMINI_API_KEY is missing, so MailAI is using a local fallback summary.",
    });
  }

  try {
    const result = await summarizeWithRetry(email);
    return res.json(result);
  } catch (error) {
    console.error("Unexpected summarize route error:", error.message);

    return res.status(500).json({
      summary: createLocalFallbackSummary(email),
      source: "fallback",
      warning: "Something went wrong, so MailAI returned a local fallback summary.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
