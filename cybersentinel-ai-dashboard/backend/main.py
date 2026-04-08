from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.environment import IncidentEnv
from inference import run_inference


app = FastAPI(title="CyberSentinel AI API 🚀")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env = IncidentEnv()


# ✅ Request model
class ActionRequest(BaseModel):
    action: str


# ✅ Home
@app.get("/")
def home():
    return {"message": "CyberSentinel Backend Running 🚀"}


# ✅ Reset
@app.get("/reset")
def reset():
    result = env.reset()

    return {
        "observation": result.observation,
        "reward": result.reward,
        "done": result.done,
        "info": result.info
    }


# ✅ Step
@app.post("/step")
def step(action: ActionRequest):
    class EnvAction:
        def __init__(self, action):
            self.action = action

    env_action = EnvAction(action.action)

    result = env.step(env_action)

    return {
        "observation": result.observation,
        "reward": result.reward,
        "done": result.done,
        "info": result.info
    }


# ✅ Infer
@app.get("/infer")
def infer():
    result = env.reset()
    obs = result.observation

    ai = run_inference(obs.dict())

    return {
        "observation": obs,
        "action": ai["action"]
    }


# ✅ STATE (🔥 FIXED FULLY)
@app.get("/state")
def get_state():
    result = env.reset()
    obs = result.observation

    alerts = []

    # 🚨 ALERT LOGIC
    if obs.cpu > 80:
        alerts.append({
            "id": "cpu",
            "title": "High CPU Usage",
            "description": "CPU usage exceeded safe threshold",
            "severity": "high",
            "status": "active"
        })

    if obs.memory > 85:
        alerts.append({
            "id": "memory",
            "title": "Memory Critical",
            "description": "Memory usage is dangerously high",
            "severity": "medium",
            "status": "active"
        })

    if obs.errors > 50:
        alerts.append({
            "id": "errors",
            "title": "System Errors Spike",
            "description": "Too many system errors detected",
            "severity": "high",
            "status": "active"
        })

    # 🤖 AI ACTION LOGIC (🔥 NEW)
    ai_actions = []

    if obs.cpu > 80:
        ai_actions.append({
            "id": "cpu_fix",
            "action": "Scale CPU resources",
            "status": "pending"
        })

    if obs.memory > 85:
        ai_actions.append({
            "id": "memory_fix",
            "action": "Restart memory-heavy service",
            "status": "pending"
        })

    if obs.errors > 50:
        ai_actions.append({
            "id": "error_fix",
            "action": "Restart failing service",
            "status": "completed"
        })

    # ✅ FINAL RESPONSE
    return {
        "cpu": obs.cpu,
        "memory": obs.memory,
        "network": getattr(obs, "network", 50),
        "errors": obs.errors,
        "logs": obs.logs,
        "alerts": alerts,

        # 🔥 REQUIRED FOR FRONTEND
        "aiActions": ai_actions,
        "status": "critical" if len(alerts) > 0 else "live"
    }