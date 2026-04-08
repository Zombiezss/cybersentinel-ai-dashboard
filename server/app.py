from fastapi import FastAPI
import uvicorn

# ✅ Import your environment + models
from backend.environment import IncidentEnv
from backend.models import Action

app = FastAPI()


# ✅ Basic health route
@app.get("/")
def root():
    return {"status": "CyberSentinel API running"}


# ✅ CRITICAL: This endpoint triggers LLM calls (required for validation)
@app.get("/run")
def run_env():
    env = IncidentEnv()

    # Reset environment (start scenario)
    state = env.reset()

    # Dummy action (LLM will override internally)
    action = Action(action="scale_up")

    # This triggers your LLM logic inside environment.step()
    result = env.step(action)

    return result.dict()


# ✅ REQUIRED main function (entry point)
def main():
    uvicorn.run(
        "server.app:app",
        host="0.0.0.0",
        port=8000
    )


# ✅ REQUIRED entry trigger
if __name__ == "__main__":
    main()