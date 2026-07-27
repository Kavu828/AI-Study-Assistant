"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
export default function UploadPage() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [notes, setNotes] = useState("");

  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);  

  const uploadImage = async () => {

  if (!selectedFile) return;

  setLoading(true);
setLoadingText("📤 Uploading file...");

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {

    setTimeout(() => {
  setLoadingText("📖 Reading image/PDF...");
}, 500);

setTimeout(() => {
  setLoadingText("🤖 AI is analyzing content...");
}, 1500);

setTimeout(() => {
  setLoadingText("📝 Creating notes...");
}, 3000);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Status:", response.status);
    console.log("OK:", response.ok);

    const data = await response.json();
    console.log("Backend Response:", data);


    setNotes(data.notes);
    setQuiz([]);
setAnswers({});
setScore(null);
setSubmitted(false);
    setLoadingText("✅ Notes generated successfully!");

  } catch (error) {

    console.error(error);
    alert("Upload Failed!");

  } finally {
      setLoading(false);
  }

  setLoading(false);
};

const generateQuiz = async () => {
  if (!notes) return;

  setQuizLoading(true);
  setAnswers({});
  setScore(null);
  setSubmitted(false);
  setQuiz([]);

  try {
    const response = await fetch("http://127.0.0.1:8000/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: notes,
      }),
    });

    const data = await response.json();

    console.log("Quiz API Response:", data);
    console.log("Raw quiz:", data.quiz);

    const quizArray =
      typeof data.quiz === "string"
        ? JSON.parse(data.quiz)
        : data.quiz;

    if (Array.isArray(quizArray)) {
      setQuiz(quizArray);
    } else {
      console.error("Quiz is not an array:", quizArray);
      setQuiz([]);
    }

  } catch (error) {
    console.error(error);
    alert("Quiz Generation Failed!");
  } finally {
    setQuizLoading(false);
  }
};


    const handleAnswer = (questionIndex: number, option: string) => {
      setAnswers((prev) => ({
    ...prev,
    [questionIndex]: option,
  }));
};

const submitQuiz = () => {
  let marks = 0;

  quiz.forEach((q: any, index: number) => {
    if (answers[index] === q.answer) {
      marks++;
    }
  });

  setScore(marks);
  setSubmitted(true);
};

  
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-cyan-400 mb-6">
        Upload Your Study Material
      </h1>

      <p className="text-gray-300 text-center max-w-2xl mb-10">
        Upload an image or a PDF and let AI generate notes,
        summaries, and important key points.
      </p>

      <div className="flex gap-6">

  <label
    htmlFor="fileUpload"
    className="bg-cyan-500 px-8 py-4 rounded-xl hover:bg-cyan-600 cursor-pointer"
  >
    📂 Upload Image / PDF
  </label>

</div>
      <input
  type="file"
  id="fileUpload"
  accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
          }
      }}
    />
    {selectedFile && (
       <div className="mt-8 text-center">

          {selectedFile.type.startsWith("image/") && (
  <img
    src={URL.createObjectURL(selectedFile)}
    alt="Preview"
    className="w-72 h-72 object-cover rounded-xl mx-auto mb-6 border-2 border-cyan-500"
  />
)}

{selectedFile.type === "application/pdf" && (
  <div className="text-8xl mb-6">
    📄
  </div>
)}
            <p className="text-lg text-green-400 font-semibold">
              ✅ Selected File:
            </p>

            <p className="text-gray-300">
              {selectedFile.name}
            </p>

            <button
  onClick={uploadImage}
  disabled={loading}
  className={`mt-6 px-8 py-3 rounded-xl ${
    loading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-cyan-500 hover:bg-cyan-600"
  }`}
>
  {loading ? "⏳ Generating Notes..." : "🤖 Generate Notes"}
</button>

              {loading && (
  <div className="mt-8 w-full max-w-4xl bg-slate-900 p-6 rounded-xl border border-cyan-500 text-center">
    <div className="text-6xl mb-4 animate-pulse">🤖</div>

    <h2 className="text-2xl font-bold text-cyan-400">
      AI is generating your notes...
    </h2>

    <p className="mt-3 text-gray-300">
      {loadingText}
    </p>
  </div>
)}
          {notes && (
              <div className="mt-10 w-full max-w-4xl bg-slate-900 p-6 rounded-xl border border-cyan-500">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                  📚 AI Generated Notes
                </h2>

                <div className="prose prose-invert max-w-none text-left">
  <ReactMarkdown>{notes}</ReactMarkdown>
  <button
  onClick={generateQuiz}
  disabled={quizLoading}
  className={`mt-6 px-8 py-3 rounded-xl ${
    quizLoading
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {quizLoading ? "⏳ Generating Quiz..." : "📝 Generate Quiz"}
</button>
</div>
              </div>
        )}

        </div>
        )}
        
  {Array.isArray(quiz) && quiz.length > 0 && (
  <div className="mt-10 w-full max-w-4xl bg-slate-900 p-6 rounded-xl border border-green-500">
    <h2 className="text-3xl font-bold text-green-400 mb-6">
      📝 AI Generated Quiz
    </h2>

    {quiz.map((q, index) => (
      <div
        key={index}
        className="mb-6 p-4 rounded-lg border border-gray-700"
      >
        <h3 className="font-semibold mb-3">
          {index + 1}. {q.question}
        </h3>

        {q.options.map((option: string, i: number) => (
          <div key={i} className="mb-2">
            <label>
              <input
              
                    type="radio"
  name={`question-${index}`}
  value={option}
  checked={answers[index] === option}
  disabled={submitted}
  onChange={() => handleAnswer(index, option)}
  className="mr-2"
/>
            
              {option}
            </label>
          </div>
        ))}

{submitted && (
  <div className="mt-4">
    <p className="text-green-400 font-semibold">
      ✅ Correct Answer: {q.answer}
    </p>

    <p className="text-gray-300">
      {q.explanation}
    </p>
  </div>
)}

      </div>
    ))}

    {!submitted && (
  <button
  onClick={submitQuiz}
  disabled={Object.keys(answers).length !== quiz.length}
  className={`mt-6 px-6 py-3 rounded-lg ${
    Object.keys(answers).length !== quiz.length
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
    Submit Quiz
  </button>
)}

{submitted && (
  <h2 className="mt-6 text-2xl font-bold text-cyan-400">
    🎯 Score: {score} / {quiz.length}
  </h2>
)}
  </div>
)}
    </main>
  );
}