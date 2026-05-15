from fastapi import APIRouter
from services.code_evaluator import evaluate_code

router = APIRouter()

coding_session = {
    "question": "",
    "code": "",
    "result": {}
}

# Generate coding question
@router.get("/question")
def get_question():

    question = """
    Write a Python function
    to reverse a string
    """

    coding_session["question"] = question

    return {
        "question": question
    }

# Submit code
@router.post("/submit")
def submit_code(data: dict):

    code = data.get("code", "")

    result = evaluate_code(code)

    coding_session["code"] = code
    coding_session["result"] = result

    return result
