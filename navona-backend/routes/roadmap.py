import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize FastAPI router
roadmap_router = APIRouter()

# Get Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq API client
groq = Groq(api_key=GROQ_API_KEY)

# Define request model
class RoadmapRequest(BaseModel):
    goal: str
    skill_level: str
    time_per_day: str
    deadline: str
    resource_preference: str

@roadmap_router.post("/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    try:
        print("Received Request:", request.dict())  # Debugging

        # Correct JSON Schema in Prompt
        prompt = (
            f"Generate a structured JSON roadmap for {request.goal}. "
            f"The user is a {request.skill_level} learner. "
            f"They can dedicate {request.time_per_day} per day and want to complete it by {request.deadline}. "
            f"Provide resources based on {request.resource_preference}. "
            f"Ensure the response is STRICTLY in JSON format, following this schema:\n"
            f'{{"weeks": [{{"week": int, "topics": ["string"], "resources": ["string"]}}]}}'
        )

        print("Prompt:", prompt)  # Debugging

        # Call Groq API
        response = groq.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{"role": "system", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}  # ✅ FIXED HERE
        )

        # Extract AI response
        ai_response_json = response.choices[0].message.content
        print("AI Response JSON:", ai_response_json)  # Debugging

        # Parse and return JSON response
        roadmap_data = json.loads(ai_response_json)
        return {"roadmap": roadmap_data}

    except Exception as e:
        print("Error:", str(e))  # Debugging
        raise HTTPException(status_code=500, detail=str(e))
