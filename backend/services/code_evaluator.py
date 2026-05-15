def evaluate_code(code):

    score = 0
    feedback = []

    # Very simple mock evaluation

    if "def" in code:
        score += 30
        feedback.append("Function detected")

    if "return" in code:
        score += 30
        feedback.append("Return statement used")

    if "for" in code or "while" in code:
        score += 20
        feedback.append("Loop used")

    if len(code) > 50:
        score += 20
        feedback.append("Good code length")

    return {
        "score": score,
        "feedback": feedback
    }
