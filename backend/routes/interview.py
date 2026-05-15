from fastapi import APIRouter
from services.ai_service import generate_ai_questions
# Import the session from your upload route [cite: 155]
from routes.upload import session as upload_session 

router = APIRouter()

interview_session = {
    "questions": [],
    "answers": [],
    "index": 0,
    "completed": False
}

@router.post("/start")
def start_interview():
    # 1. Reset the session state 
    interview_session["index"] = 0 
    interview_session["completed"] = False
    interview_session["answers"] = []
    
    # 2. Get the data stored from the Day 2 upload step [cite: 155]
    resume = upload_session.get("resume_text", "")
    jd = upload_session.get("jd", "")
    
    # 3. Check if data exists before calling AI
    if not resume or not jd:
        return {"error": "Resume or JD missing. Please upload them first."}
    
    # 4. Generate and process questions [cite: 353, 358]
    raw_text = generate_ai_questions(resume, jd)
    questions = [q.strip() for q in raw_text.split('\n') if q.strip()]
    
    interview_session["questions"] = questions
    
    # Debug print to your terminal to see if questions are actually created
    print(f"Generated {len(questions)} questions.") 
    
    return {"message": "Questions generated", "count": len(questions)}

@router.get("/next")
def next_question():
    i = interview_session["index"]
    questions = interview_session["questions"]

    # If questions list is empty, this returns "completed" immediately
    if not questions or i >= len(questions):
        interview_session["completed"] = True
        return {"message": "Interview completed"}

    return {
        "question": questions[i],
        "question_number": i + 1
    }

@router.post("/answer")
def submit_answer(data: dict):
    answer = data.get("answer")
    interview_session["answers"].append(answer)
    interview_session["index"] += 1
    return {"message": "Answer saved"}