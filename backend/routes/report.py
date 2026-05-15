from fastapi import APIRouter

from routes.interview import interview_session
from routes.coding import coding_session

from services.scoring import generate_report

router = APIRouter()

@router.get("/final-report")
def final_report():

    answers = interview_session["answers"]

    coding_score = (
        coding_session["result"]
        .get("score", 0)
    )

    report = generate_report(
        answers,
        coding_score
    )

    return report
