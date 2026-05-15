import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import your routes
from routes.upload import router as upload_router
from routes.interview import router as interview_router
from routes.coding import router as coding_router
from routes.report import router as report_router

# Load environment variables (for your Groq API Key)
load_dotenv()

# 1. Create the app ONCE
app = FastAPI(title="AI Interview Platform")

# 2. CORS - Ensure this matches your frontend URL
origins = [
    "http://localhost:3000",
    "https://ai-interview-platform-ten-tau.vercel.app",
    # If you have other Vercel preview links, add them here too
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the list we just made
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include routers with consistent prefixes
app.include_router(upload_router)
app.include_router(interview_router, prefix="/interview", tags=["Interview"])
app.include_router(coding_router, prefix="/coding", tags=["Coding"])
app.include_router(report_router, tags=["Report"])

@app.get("/health")
def health():
    # Helpful check to see if your Groq Key is loaded
    groq_status = "Loaded" if os.getenv("GROQ_API_KEY") else "MISSING"
    return {
        "status": "ok",
        "groq_api_key": groq_status
    }