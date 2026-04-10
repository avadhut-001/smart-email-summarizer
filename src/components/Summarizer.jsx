import { useState } from "react";

const sampleEmail = `Hi Avadhut,

Thanks for applying to the Product Analyst role. We reviewed your profile and would like to invite you for a first-round interview next Tuesday or Wednesday. Please reply with your preferred slot by Friday. The role is hybrid, based in Pune, and the compensation range will be shared after the next stage.

Best,
Hiring Team`;

export default function Summarizer({ setView }) {
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleSummarize = async () => {
    if (!email.trim()) {
      setError("Paste an email first so MailAI has something to summarize.");
      setSummary("");
      setWarning("");
      return;
    }

    setLoading(true);
    setError("");
    setWarning("");

    try {
      const res = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No summary returned");
      }

      if (!data.summary) {
        throw new Error("No summary returned");
      }

      setSummary(data.summary);
      setWarning(data.warning || "");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "The backend is unavailable right now. Start the server and try again.");
      setSummary("");
      setWarning("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="panel-surface rounded-[32px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Input
            </p>
            <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">
              Paste the full email
            </h2>
          </div>

          <button
            onClick={() => setEmail(sampleEmail)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-white/15 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
          >
            Load sample
          </button>
        </div>

        <div className="mt-6">
          <textarea
            className="min-h-[320px] w-full rounded-[28px] border border-slate-200 bg-white/80 px-5 py-4 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500"
            rows="10"
            placeholder="Paste a long email, newsletter, job update, or internal thread here..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            {loading ? "Summarizing..." : "Generate summary"}
          </button>
          <button
            onClick={() => {
              setEmail("");
              setSummary("");
              setError("");
              setWarning("");
            }}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-white/15 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
          >
            Clear
          </button>
          <button
            onClick={() => setView("about")}
            className="rounded-full px-2 py-3 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            See what MailAI is for
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-[24px] border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {warning ? (
          <div className="mt-4 rounded-[24px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
            {warning}
          </div>
        ) : null}
      </section>

      <aside className="panel-surface rounded-[32px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Output
        </p>
        <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">
          Summary panel
        </h2>

        <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">AI result</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
              ready
            </span>
          </div>

          <p className="mt-6 min-h-[220px] text-base leading-8 text-slate-100">
            {summary ||
              "Your summary will appear here once you submit an email. The result area is designed to feel like a polished reading card rather than a plain output box."}
          </p>
        </div>

        
      </aside>
    </div>
  );
}
