from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router
from routes.roadmap import roadmap_router  # Import roadmap routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


import os
import uvicorn


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    #allow_origins=["http://localhost:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)  
app.include_router(roadmap_router)  # Include roadmap routes

@app.post("/generate-pdf/")
async def generate_pdf(roadmap: dict):
    pdf_filename = "roadmap.pdf"
    pdf_path = f"/tmp/{pdf_filename}"  # Adjust path as needed

    try:
        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(100, 750, "🎯 Your Custom Roadmap")

        y = 720
        for week in roadmap.get("weeks", []):
            c.setFont("Helvetica-Bold", 14)
            c.drawString(100, y, f"📆 Week {week['week']}")
            y -= 20

            c.setFont("Helvetica", 12)
            c.drawString(120, y, f"📖 Topics: {', '.join(week.get('topics', []))}")
            y -= 20

            c.drawString(120, y, "📚 Resources:")
            y -= 15

            for resource in week.get("resources", []):
                c.drawString(140, y, f"• {resource}")
                y -= 15

            y -= 10  # Extra spacing between weeks

        c.save()

        return FileResponse(pdf_path, filename=pdf_filename, media_type="application/pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")
