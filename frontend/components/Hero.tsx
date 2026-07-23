export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center mt-24 px-6">
      <h2 className="text-6xl font-extrabold mb-6">
        Learn Smarter with AI
      </h2>

      <p className="text-xl text-gray-300 max-w-3xl">
        Upload Images or Videos, generate AI Notes, create quizzes,
        evaluate answers, and improve your learning experience.
      </p>

      <div className="mt-10 flex gap-6">
        <button className="bg-cyan-500 px-8 py-4 rounded-xl hover:bg-cyan-600">
          📷 Upload Image
        </button>

        <button className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700">
          🎥 Upload Video
        </button>
      </div>
    </section>
  );
}