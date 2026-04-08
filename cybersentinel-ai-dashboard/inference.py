from backend.environment import IncidentEnv
from backend.models import Action
from pydantic import BaseModel


# ✅ Models (unchanged)
class Observation(BaseModel):
    cpu: int
    memory: int
    errors: int
    logs: str


class ActionModel(BaseModel):
    action: str


# ✅ Decision logic (unchanged, good)
def run_inference(observation: dict) -> dict:
    cpu = observation.get("cpu", 0)
    memory = observation.get("memory", 0)
    errors = observation.get("errors", 0)
    logs = observation.get("logs", "").lower()

    # Detect scenario using logs
    if "ddos" in logs:
        return {"action": "block_ip"}

    if "memory" in logs:
        return {"action": "restart_service"}

    if "cpu" in logs:
        return {"action": "scale_up"}

    # Fallback using metrics
    if errors >= 150:
        return {"action": "block_ip"}

    if errors >= 80:
        return {"action": "restart_service"}

    if errors > 0:
        return {"action": "scale_up"}

    return {"action": "scale_up"}


# ✅ Main runner (FIXED: stable action)
def run_episode(scenario):

    env = IncidentEnv()
    result = env.reset(forced_scenario=scenario)

    print(f"[START] task={scenario} env=cybersentinel model=rule-based")

    done = False
    step = 0
    rewards = []

    chosen_action = None  # 🔥 FIX: remember action

    try:
        while not done and step < 10:

            obs_dict = result.observation.model_dump()

            # 🔥 Decide action only once
            if step == 0:
                action_output = run_inference(obs_dict)
                chosen_action = action_output.get("action", "scale_up")

            # 🔥 Reuse same action
            action = Action(action=chosen_action)

            result = env.step(action)

            reward = round(result.reward, 2)
            done_flag = str(result.done).lower()

            print(
                f"[STEP] step={step+1} action={action.action} "
                f"reward={reward:.2f} done={done_flag} error=null"
            )

            rewards.append(reward)
            done = result.done
            step += 1

        success = done
        score = sum(rewards) / len(rewards) if rewards else 0.0
        score = round(min(max(score, 0.0), 1.0), 2)

        rewards_str = ",".join(f"{r:.2f}" for r in rewards)

        print(
            f"[END] success={str(success).lower()} "
            f"steps={step} score={score:.2f} rewards={rewards_str}"
        )

    except Exception:
        print(f"[END] success=false steps={step} score=0.00 rewards=")


# ✅ ENTRY POINT (unchanged)
if __name__ == "__main__":

    scenarios = ["cpu_overload", "memory_leak", "ddos_attack"]

    for scenario in scenarios:
        run_episode(scenario)