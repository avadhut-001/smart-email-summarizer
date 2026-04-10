import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Summarizer from "./components/Summarizer";
import About from "./components/About";

const viewContent = {
  home: {
    eyebrow: "Inbox clarity, not overload",
    title: "Turn dense email threads into a quick decision-ready brief.",
    description:
      "Paste any long email and get a concise summary that pulls forward the details you actually need.",
  },
  summarize: {
    eyebrow: "AI summarizer",
    title: "Drop in the message. Get the signal in seconds.",
    description:
      "Built for long updates, hiring mails, internal announcements, and client threads that need a faster read.",
  },
  about: {
    eyebrow: "Why MailAI",
    title: "A focused tool for people who need faster context, not more tabs.",
    description:
      "MailAI keeps the product lightweight while helping you skim faster, respond sooner, and stay on top of busy inboxes.",
  },
};

function App() {
  const [view, setView] = useState("home");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const currentView = viewContent[view];

  return (
    <div className="app-shell min-h-screen text-slate-950 transition-colors duration-300 dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-overlay" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Navbar
          view={view}
          setView={setView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 pt-6 sm:pt-10">
          <section className="mb-8">
            <div className="panel-surface overflow-hidden rounded-[32px] border border-white/60 px-6 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:border-white/10 sm:px-8 lg:px-10 lg:py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-700 dark:text-amber-300">
                {currentView.eyebrow}
              </p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
                <div>
                  <h1 className="max-w-4xl font-serif text-4xl leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                    {currentView.title}
                  </h1>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  {currentView.description}
                </p>
              </div>
            </div>
          </section>

          <section>
            {view === "home" && <Hero setView={setView} />}
            {view === "summarize" && <Summarizer setView={setView} />}
            {view === "about" && <About />}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
