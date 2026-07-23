from fastapi import APIRouter, UploadFile, File
from services.ai_service import generate_notes
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    notes = generate_notes(file_path)

    return {
        "message": "Image uploaded successfully!",
        "filename": file.filename,
        "notes": notes
    }