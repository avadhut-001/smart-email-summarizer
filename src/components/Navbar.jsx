const navItems = [
  { id: "home", label: "Home" },
  { id: "summarize", label: "Summarize" },
  { id: "about", label: "About" },
];

export default function Navbar({ view, setView, darkMode, setDarkMode }) {
  return (
    <header className="sticky top-4 z-20">
      <div className="panel-surface flex flex-col gap-4 rounded-[28px] border border-white/60 px-4 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            M
          </div>
          <div>
            <p className="font-serif text-xl text-slate-950 dark:text-white">
              MailAI
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Smart Email Summaries
            </p>
          </div>
        </button>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = item.id === view;

            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex items-center justify-center rounded-full border border-slate-300/70 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-white/15 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
        >
          {darkMode ? "Switch to light" : "Switch to dark"}
        </button>
      </div>
    </header>
  );
}
