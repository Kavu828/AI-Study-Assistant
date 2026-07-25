"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
export default function UploadPage() {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [notes, setNotes] = useState("");
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
    setLoadingText("✅ Notes generated successfully!");

  } catch (error) {

    console.error(error);
    alert("Upload Failed!");

  } finally {
      setLoading(false);
  }

  setLoading(false);
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
</div>
              </div>
        )}

        </div>
        )}
    </main>
  );
}