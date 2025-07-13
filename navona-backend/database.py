from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["NavonaDB"]
users_collection = db["users"]

print("Connected to MongoDB at:", MONGO_URL)


if __name__ == "__main__":
	print("Yes" if client else "no")
