from openai import OpenAI
from dotenv import load_dotenv
import base64
import os
import json

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


def test_ai():
    response = client.chat.completions.create(
        model="openrouter/free",
        messages=[
            {
                "role": "user",
                "content": "Say hello to Kavana. Tell her the AI backend is working."
            }
        ]
    )

    return response.choices[0].message.content


def generate_notes(data, is_text=False):
    try:

        # -------- PDF/Text --------
        if is_text:
            response = client.chat.completions.create(
                model="openrouter/free",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
You are an AI Study Assistant.

The following is text extracted from a PDF:

{data}

Generate:
1. Easy-to-understand notes.
2. Short summary.
3. Important key points.

Explain everything in simple language for students.
"""
                    }
                ]
            )

            content = response.choices[0].message.content.strip()

            if content.startswith("User Safety:"):
                lines = content.splitlines()
                while lines and lines[0].startswith("User Safety:"):
                    lines.pop(0)
                content = "\n".join(lines).strip()

            return content

        # -------- Image --------
        with open(data, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
Analyze this study image.

Generate:
1. Easy-to-understand notes.
2. Short summary.
3. Important key points.

Explain everything in simple language for students.
"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ]
        )

        content = response.choices[0].message.content.strip()

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
        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "user",
                    "content": f"""
You are an AI Quiz Generator.

Using ONLY the study notes below, generate exactly 15 multiple-choice questions.

Return ONLY a valid JSON array.

The first character must be [
The last character must be ]

Do not return:
- User Safety
- Safety messages
- Markdown
- Triple backticks
- Any explanation before or after the JSON

Format:

[
  {{
    "question": "Question here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct Option",
    "explanation": "Short explanation"
  }}
]

Study Notes:
{notes}
"""
                }
            ]
        )

        content = response.choices[0].message.content.strip()

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