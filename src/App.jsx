import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Summarizer from "./components/Summarizer";
import About from "./components/About";

function App() {
  const [view, setView] = useState("home");
  const [darkMode, setDarkMode] = useState(true);

  // Apply dark class
useEffect(() => {
  const root = document.documentElement;

  if (darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}, [darkMode]);
  return (
    <div className="min-h-screen transition duration-300 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white dark:text-gray-100">

      <Navbar setView={setView} darkMode={darkMode} setDarkMode={setDarkMode} />

      {view === "home" && <Hero setView={setView} />}

      {view === "summarize" && (
        <div className="mt-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Summarize emails,
            <br />
            <span className="text-purple-200 dark:text-purple-400">
              instantly with AI
            </span>
          </h1>

          <Summarizer />
        </div>
      )}

      {view === "about" && <About />}
    </div>
  );
}

export default App;