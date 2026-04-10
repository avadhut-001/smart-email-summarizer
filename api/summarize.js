/* global process */

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

async function requestGeminiSummary(model, email, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
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
                text: buildPrompt(email),
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Gemini request failed");
    error.status = response.status;
    error.details = data;
    throw error;
  }

  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanSummaryText(raw);
}

async function summarizeWithRetry(email, apiKey) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const summary = await requestGeminiSummary(model, email, apiKey);

        if (summary) {
          return {
            summary,
            source: "ai",
            model,
          };
        }

        throw new Error("Empty summary returned from Gemini");
      } catch (error) {
        lastError = error;
        const retryable =
          error.status === 429 || error.status === 500 || error.status === 503;

        if (!retryable) {
          break;
        }

        if (attempt < 3) {
          await sleep(1200 * 2 ** (attempt - 1));
        }
      }
    }
  }

  return {
    summary: createLocalFallbackSummary(email),
    source: "fallback",
    model: null,
    warning:
      "AI service is temporarily busy, so this summary was generated locally from the email text.",
    lastError:
      lastError?.details?.error?.message || lastError?.message || "Unknown error",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || !email.trim()) {
    return res.status(400).json({
      summary: "",
      source: "none",
      error: "Please enter email text.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      summary: createLocalFallbackSummary(email),
      source: "fallback",
      warning:
        "GEMINI_API_KEY is missing, so MailAI is using a local fallback summary.",
    });
  }

  try {
    const result = await summarizeWithRetry(email, apiKey);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      summary: createLocalFallbackSummary(email),
      source: "fallback",
      warning: "Something went wrong, so MailAI returned a local fallback summary.",
      lastError: error.message,
    });
  }
}
