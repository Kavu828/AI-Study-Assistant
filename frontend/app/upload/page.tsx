"use client";

import { useState } from "react";

export default function UploadPage() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const uploadImage = async () => {

  if (!selectedFile) return;

  setLoading(true);

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Status:", response.status);
    console.log("OK:", response.ok);

    const data = await response.json();
    console.log("Backend Response:", data);


    setNotes(data.notes);

  } catch (error) {

    console.error(error);
    alert("Upload Failed!");

  }

  setLoading(false);
};
  
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-cyan-400 mb-6">
        Upload Your Study Material
      </h1>

      <p className="text-gray-300 text-center max-w-2xl mb-10">
        Upload an image or a video and let AI generate notes,
        summaries, quizzes, and personalized learning content.
      </p>

      <div className="flex gap-6">

        <label
  htmlFor="imageUpload"
  className="bg-cyan-500 px-8 py-4 rounded-xl hover:bg-cyan-600 cursor-pointer"
>
  📷 Upload Image
</label>

        <button className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700">
          🎥 Upload Video
        </button>

      </div>
      <input
        type="file"
        id="imageUpload"
        className="hidden"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
          }
      }}
    />
    {selectedFile && (
       <div className="mt-8 text-center">

          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-72 h-72 object-cover rounded-xl mx-auto mb-6 border-2 border-cyan-500"
          />

            <p className="text-lg text-green-400 font-semibold">
              ✅ Selected File:
            </p>

            <p className="text-gray-300">
              {selectedFile.name}
            </p>

            <button
              onClick={uploadImage}
              className="mt-6 bg-cyan-500 px-8 py-3 rounded-xl hover:bg-cyan-600"
            >
              {loading ? "⏳ Generating Notes..." : "🤖 Generate Notes"}
            </button>

            {notes && (
              <div className="mt-10 w-full max-w-4xl bg-slate-900 p-6 rounded-xl border border-cyan-500">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                  📚 AI Generated Notes
                </h2>

                <pre className="whitespace-pre-wrap text-gray-300">
                  {notes}
                </pre>
              </div>
        )}

        </div>
        )}
    </main>
  );
}