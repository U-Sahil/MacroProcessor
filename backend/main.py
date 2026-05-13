from fastapi import FastAPI
from routes import macro
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "Backend is running"}

app.include_router(macro.router, prefix="/macro", tags=["Macro Processor"])