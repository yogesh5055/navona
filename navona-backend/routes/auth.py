from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from security import verify_password, hash_password, create_access_token, decode_access_token
from database import users_collection
from fastapi.security import OAuth2PasswordBearer
from bson.objectid import ObjectId

auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # Ensure this matches login route

class UserSignup(BaseModel):
    username: str
    email: EmailStr  # ✅ Ensures email is valid
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ User Signup Route
@auth_router.post("/signup")
async def signup(user: UserSignup):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = {"username": user.username, "email": user.email, "password": hashed_password}

    print("Before inserting user:", new_user)  # Debug log

    result = users_collection.insert_one(new_user)

    print("Inserted user ID:", result.inserted_id)  # Debug log

    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to insert user")

    # ✅ Generate JWT Token after successful signup
    token = create_access_token(data={"user_id": str(result.inserted_id)})

    return {"message": "User registered successfully", "access_token": token, "token_type": "bearer"}


# ✅ User Login Route with JWT Token
@auth_router.post("/login")
async def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, existing_user["password"]):  # ✅ Fix password verification
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Generate JWT Token
    token = create_access_token(data={"user_id": str(existing_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

# ✅ Get Logged-in User Details
@auth_router.get("/me")
async def get_user_details(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"_id": ObjectId(payload["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": {"username": user["username"], "email": user["email"]}}

# ✅ Logout Route (Clears token on frontend)
@auth_router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
