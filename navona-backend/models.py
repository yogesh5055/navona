from pydantic import BaseModel, EmailStr
from pydantic import BaseModel

class RoadmapRequest(BaseModel):
    goal: str
    skill_level: str
    time_per_day: str
    deadline: str
    resource_preference: str

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
