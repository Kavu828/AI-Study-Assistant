from openai import OpenAI
from dotenv import load_dotenv
import base64
import os

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

            return response.choices[0].message.content

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

Explain in simple language for students.
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

        return response.choices[0].message.content

    except Exception as e:
        print("OpenRouter Error:", e)
        return f"OpenRouter Error: {e}"