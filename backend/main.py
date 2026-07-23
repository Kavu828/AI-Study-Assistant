from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.ai_service import test_ai
from routes.upload import router as upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Study Assistant Backend!"
    }


@app.get("/test-ai")
def test():

    return {
        "response": test_ai()
    }