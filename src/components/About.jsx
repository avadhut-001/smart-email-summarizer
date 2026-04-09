import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="mt-16 px-6 flex justify-center">
      
      <div className="max-w-4xl w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl">

        {/* Title Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          About MailAI
        </motion.h1>

        {/* Quote Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 p-6 rounded-2xl mb-8 text-center"
        >
          <p className="text-lg italic text-gray-100">
            "Transform long emails into clear, concise summaries instantly using AI."
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {[
            {
              title: "⚡ Fast & Efficient",
              text: "MailAI quickly processes long email content and provides short summaries, saving valuable time."
            },
            {
              title: "🤖 AI Powered",
              text: "Powered by advanced AI models that understand context and extract key insights."
            },
            {
              title: "🎯 User Friendly",
              text: "Clean and simple UI designed for smooth user experience without complexity."
            },
            {
              title: "🚀 Scalable SaaS",
              text: "Built as a SaaS platform with future scope like authentication and dashboards."
            }
          ].map((card, index) => (
            
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-white/20 cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-3">
                {card.title}
              </h2>
              <p className="text-gray-200 text-sm">
                "{card.text}"
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </div>
  );
}