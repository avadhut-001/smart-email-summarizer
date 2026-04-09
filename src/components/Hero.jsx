export default function Hero({ setView }) {
  return (
    <div className="text-center mt-16 px-6">
      
      <p className="text-sm tracking-widest text-purple-200">
        AI EMAIL TOOL
      </p>

      <h1 className="text-5xl md:text-6xl font-bold mt-4">
        Summarize emails,
        <br />
        <span className="text-purple-200">instantly with AI</span>
      </h1>

      <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
        Turn long emails into short, clear summaries.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setView("summarize")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          Try Now
        </button>

        <button className="border border-white/30 px-6 py-3 rounded-full hover:bg-white/10">
          Learn More
        </button>
      </div>
    </div>
  );
}