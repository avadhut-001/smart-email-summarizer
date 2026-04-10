const featureCards = [
  {
    title: "Clean summaries",
    text: "Compress long updates into a short paragraph that preserves the useful context.",
  },
  {
    title: "Fast triage",
    text: "Skim offers, announcements, and project threads without re-reading the full message.",
  },
  {
    title: "Focused output",
    text: "Keep the important details visible so it is easier to decide what needs a reply.",
  },
];

export default function Hero({ setView }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="panel-surface rounded-[32px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 sm:p-8">
        <div className="inline-flex rounded-full border border-amber-500/20 bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200">
          Reduce inbox fatigue
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          MailAI helps you turn crowded inbox moments into quick reading moments.
          Paste a long message, let the model extract the essentials, and move on
          with a cleaner understanding of what matters.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setView("summarize")}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Open summarizer
          </button>
          <button
            onClick={() => setView("about")}
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-white/15 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
          >
            Learn how it works
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-slate-200 bg-white/70 p-5 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <aside className="panel-surface relative overflow-hidden rounded-[32px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 sm:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/10" />

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Example result
        </p>

        <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">Summary preview</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
              concise
            </span>
          </div>

          <p className="mt-6 text-base leading-7 text-slate-100">
            The sender is inviting you to interview for a product role next
            week, asks you to confirm your preferred time slot by Friday, and
            notes that compensation details will be discussed after the final
            round.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Best for
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Job updates, long internal emails, client recaps, and newsletters
              you want to skim faster.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Output style
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Short, direct, and easy to scan without filler phrases or bullet
              clutter.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
