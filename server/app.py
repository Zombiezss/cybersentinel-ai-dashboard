from fastapi import FastAPI
import uvicorn

from backend.environment import IncidentEnv
from backend.models import Action

app = FastAPI()

# ✅ ONE shared environment
env = IncidentEnv()


@app.get("/")
def root():
    return {"status": "CyberSentinel API running"}


# ✅ REQUIRED
@app.post("/reset")
def reset():
    return env.reset().dict()


# ✅ REQUIRED (TRIGGERS LLM 🔥)
@app.post("/step")
def step(action: Action):
    return env.step(action).dict()


# ✅ OPTIONAL
@app.get("/state")
def state():
    return env.state().dict()


def main():
    uvicorn.run(
        "backend.app:app",   # ✅ FIXED (only change)
        host="0.0.0.0",
        port=7860
    )


if __name__ == "__main__":
    main()
