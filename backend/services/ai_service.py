
from google import genai
from google.genai import types
from dotenv import load_dotenv
import base64
import os
import json

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def test_ai():
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents="Say hello to Kavana. Tell her the AI backend is working."
    )

    return response.text

def generate_notes(data, is_text=False):
    try:

        # -------- PDF/Text --------
        if is_text:
            response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=f"""
You are an AI Study Assistant.

The following is text extracted from a PDF:

{data}

Generate:
1. Easy-to-understand notes.
2. Short summary.
3. Important key points.

Explain everything in simple language for students.
"""
)

            content = response.text

            if content.startswith("User Safety:"):
                lines = content.splitlines()
                while lines and lines[0].startswith("User Safety:"):
                    lines.pop(0)
                content = "\n".join(lines).strip()

            return content

                # -------- Image --------
        with open(data, "rb") as f:
            image_bytes = f.read()

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=[
                """
Analyze this study image.

Generate:
1. Easy-to-understand notes.
2. Short summary.
3. Important key points.

Explain everything in simple language for students.
""",
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type="image/jpeg"
                )
            ]
        )

        content = response.text

        if content.startswith("User Safety:"):
            lines = content.splitlines()
            while lines and lines[0].startswith("User Safety:"):
                lines.pop(0)
            content = "\n".join(lines).strip()

        return content

    except Exception as e:
        print("OpenRouter Error:", e)
        return f"OpenRouter Error: {e}"
    
def generate_quiz(notes):
    try:
        response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=f"""
You are an AI Quiz Generator.

Using ONLY the study notes below, generate exactly 15 multiple-choice questions.

Return ONLY a valid JSON array.

Each question MUST follow this exact format:

[
  {{
    "question": "Question text",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "answer": "One of the four options exactly as written above",
    "explanation": "Short explanation"
  }}
]

Rules:
- Exactly 15 questions.
- Exactly 4 options per question.
- The value of "answer" MUST be an exact copy of one of the options.
- Do NOT use option letters like A, B, C, or D.
- Do NOT add extra spaces, punctuation, or markdown.
- Return ONLY the JSON array.

Study Notes:

{notes}
"""
)

        content = response.text.strip()

        # Remove "User Safety" text
        if content.startswith("User Safety:"):
            lines = content.splitlines()
            while lines and lines[0].startswith("User Safety:"):
                lines.pop(0)
            content = "\n".join(lines).strip()

        # Remove markdown
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

        # Extract JSON array
        start = content.find("[")
        end = content.rfind("]")

        if start != -1 and end != -1:
            content = content[start:end + 1]

        print("========== AI RESPONSE ==========")
        print(content)
        print("=================================")

        # Validate JSON
        quiz = json.loads(content)

        return json.dumps(quiz)

    except Exception as e:
        print("Quiz Error:", e)
        return "[]"