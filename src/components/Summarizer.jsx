import { useState } from "react";

export default function Summarizer() {
    const [email, setEmail] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        if (!email) {
            alert("Please enter email text");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            console.log("API response:", data); // 👈 ADD THIS

            setSummary(data.summary);
        } catch (err) {
            console.error("Error:", err);
            alert("Backend not working");
        }

        setLoading(false);
    };

    return (
        <div className="mt-10 flex justify-center">
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl">

                <textarea
                    className="w-full p-4 rounded-lg text-black"
                    rows="6"
                    placeholder="Paste long email here..."
                    value={email}   // ✅ IMPORTANT
                    onChange={(e) => setEmail(e.target.value)}  // ✅ IMPORTANT
                />

                <button
                    onClick={handleSummarize}
                    className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg"
                >
                    {loading ? "Summarizing..." : "Summarize"}
                </button>

                {summary && (
                    <div className="mt-6 bg-white/20 p-4 rounded-lg">
                        <p>{summary}</p>
                    </div>
                )}
            </div>
        </div>
    );
}