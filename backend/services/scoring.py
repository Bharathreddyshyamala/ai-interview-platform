def generate_report(interview_answers,
                    coding_score):

    communication = len(interview_answers) * 10

    technical = 70

    overall = (
        communication +
        technical +
        coding_score
    ) // 3

    if overall >= 75:
        decision = "Selected"

    elif overall >= 50:
        decision = "Maybe"

    else:
        decision = "Rejected"

    return {
        "communication_score": communication,
        "technical_score": technical,
        "coding_score": coding_score,
        "overall_score": overall,
        "decision": decision
    }
