from fastapi import APIRouter, UploadFile, File, Form
from services.resume_parser import extract_text_from_pdf

router = APIRouter()

session = {
    "resume_text": "",
    "jd": ""
}

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()

    text = extract_text_from_pdf(contents)
    session["resume_text"] = text

    return {
        "message": "Resume uploaded",
        "preview": text[:300]
    }


@router.post("/submit-jd")
async def submit_jd(jd: str = Form(...)):
    session["jd"] = jd

    return {
        "message": "JD received"
    }


@router.get("/session")
def get_session():
    return session