from fastapi import FastAPI
import uvicorn

# ✅ Import your environment + models
from backend.environment import IncidentEnv
from backend.models import Action

app = FastAPI()

# ✅ Use ONE shared environment (important)
env = IncidentEnv()


# ✅ Basic health route (keep as is)
@app.get("/")
def root():
    return {"status": "CyberSentinel API running"}


# ❌ OLD /run (keep if you want, but not used by validator)
@app.get("/run")
def run_env():
    state = env.reset()
    action = Action(action="scale_up")
    result = env.step(action)
    return result.dict()


# ✅ ADD THIS (REQUIRED)
@app.post("/reset")
def reset():
    return env.reset().dict()


# ✅ ADD THIS (CRITICAL – triggers LLM)
@app.post("/step")
def step(action: Action):
    return env.step(action).dict()


# ✅ OPTIONAL (safe)
@app.get("/state")
def state():
    return env.state().dict()


# ✅ REQUIRED main function
def main():
    uvicorn.run(
        "server.app:app",
        host="0.0.0.0",
        port=7860   # ⚠️ changed from 8000 → required for HF
    )


# ✅ REQUIRED entry trigger
if __name__ == "__main__":
    main()
