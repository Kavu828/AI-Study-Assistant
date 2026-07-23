export default function Features() {
  const features = [
    {
      title: "📝 AI Notes",
      description: "Generate smart notes from uploaded images and videos."
    },
    {
      title: "📄 AI Summary",
      description: "Get quick summaries of lengthy study materials."
    },
    {
      title: "❓ AI Quiz",
      description: "Automatically create quizzes from your notes."
    },
    {
      title: "✅ Answer Evaluation",
      description: "Evaluate your answers with AI and receive feedback."
    },
    {
      title: "📊 Dashboard",
      description: "Track your learning progress and performance."
    },
    {
      title: "🎯 Study Planner",
      description: "Receive personalized study plans based on your progress."
    }
  ];

  return (
    <section className="py-20 px-10">
      <h2 className="text-4xl font-bold text-center mb-12">
        Powerful AI Features
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-2xl font-semibold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}