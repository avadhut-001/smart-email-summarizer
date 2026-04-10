const cards = [
  {
    title: "Quick signal extraction",
    text: "MailAI is aimed at the moment when you need the gist of an email before deciding whether to reply, archive, or schedule follow-up.",
  },
  {
    title: "A calmer reading surface",
    text: "The refreshed interface uses warmer tones, softer cards, and stronger typography so the product feels deliberate instead of template-like.",
  },
  {
    title: "Practical use cases",
    text: "It works well for interview emails, client updates, team announcements, newsletters, and status-heavy conversations.",
  },
  {
    title: "Room to grow",
    text: "This layout can expand into saved summaries, inbox integrations, team spaces, or usage analytics without a redesign from scratch.",
  },
];

export default function About() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="panel-surface rounded-[32px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Product snapshot
        </p>
        <h2 className="mt-2 font-serif text-3xl text-slate-900 dark:text-white">
          Built to shorten reading time without losing the point.
        </h2>

        <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
          The project takes raw email text, sends it to the backend summarizer,
          and returns a concise paragraph. The UI refresh focuses on trust,
          clarity, and rhythm so the experience feels closer to a real product
          landing page and workspace.
        </p>

        <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(51,65,85,0.92))] p-6 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-200">
            Design direction
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-100">
            Editorial typography, warm neutrals, layered glass surfaces, and a
            more balanced desktop-to-mobile layout.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="panel-surface rounded-[28px] border border-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1 dark:border-white/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-sm font-semibold text-amber-800 dark:bg-amber-300/10 dark:text-amber-200">
              0{index + 1}
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {card.text}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
