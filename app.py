from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil
import uuid

BASE = Path(__file__).resolve().parent
UPLOADS = BASE / "uploads"
UPLOADS.mkdir(exist_ok=True)

app = FastAPI(title="ObjectForge")
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")

@app.get("/")
def index():
    return FileResponse(BASE / "static" / "index.html")

@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "ObjectForge"}

@app.post("/api/reconstruct")
async def reconstruct(files: list[UploadFile] = File(...)):
    # Lightweight prototype endpoint.
    # The current demo visualizes a deterministic voxel reconstruction in-browser.
    saved = []
    for f in files:
        suffix = Path(f.filename or "").suffix.lower()
        if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        name = f"{uuid.uuid4().hex}{suffix}"
        target = UPLOADS / name
        with target.open("wb") as out:
            shutil.copyfileobj(f.file, out)
        saved.append(name)

    return JSONResponse({
        "status": "processed",
        "views": len(saved),
        "message": "Views received. Browser-side reconstruction preview generated.",
        "model": {
            "type": "voxel",
            "resolution": 28,
            "points": 4200
        }
    })
