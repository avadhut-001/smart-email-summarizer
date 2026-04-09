export default function Navbar({ setView, darkMode, setDarkMode }) {
  return (
    <div className="flex justify-between items-center px-8 py-5">
      
      <h1 className="text-2xl font-bold">MailAI</h1>

      <div className="hidden md:flex gap-8 text-sm">
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("summarize")}>Summarize</button>
        <button onClick={() => setView("about")}>About</button>
      </div>

      {/* 🌙 Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-white/20 px-4 py-2 rounded-full backdrop-blur hover:scale-105 transition"
      >
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}