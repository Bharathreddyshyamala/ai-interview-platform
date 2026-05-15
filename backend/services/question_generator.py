def generate_questions(resume_text, jd):

    questions = [
        "Tell me about yourself",
        "Why are you interested in this role?"
    ]

    # Resume-based questions
    if "Python" in resume_text:
        questions.append(
            "Explain a Python project you worked on"
        )

    if "React" in resume_text:
        questions.append(
            "What are React hooks?"
        )

    if "Machine Learning" in resume_text:
        questions.append(
            "Explain a machine learning project"
        )

    # JD-based questions
    if "team" in jd.lower():
        questions.append(
            "Describe your teamwork experience"
        )

    if "API" in jd:
        questions.append(
            "How do you build REST APIs?"
        )

    questions.append(
        "Do you have any questions for us?"
    )

    return questions
