import os
from groq import Groq
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Setup the Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_ai_questions(resume_text, job_description):
    """Generates 5 questions based on resume and JD using Groq."""
    prompt = f"""
    You are an AI Interviewer. Based on the Resume and Job Description below, 
    generate 5 specific technical interview questions.
    
    Resume: {resume_text}
    Job Description: {job_description}
    
    Return ONLY the questions as a numbered list.
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant", # High-speed, free-tier model
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error calling Groq: {str(e)}"
