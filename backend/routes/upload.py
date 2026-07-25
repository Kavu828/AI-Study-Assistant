from fastapi import APIRouter, UploadFile, File
from services.ai_service import generate_notes
from services.pdf_service import extract_text_from_pdf
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extension = os.path.splitext(file.filename)[1].lower()

    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)
        notes = generate_notes(text, is_text=True)

        return {
            "message": "PDF uploaded successfully!",
            "filename": file.filename,
            "notes": notes
        }

    else:
        notes = generate_notes(file_path)

        return {
            "message": "Image uploaded successfully!",
            "filename": file.filename,
            "notes": notes
        }