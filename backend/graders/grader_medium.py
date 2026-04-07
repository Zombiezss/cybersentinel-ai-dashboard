from backend.environment import IncidentEnv
from backend.models import Action
from backend.tasks.medium import run_medium


def grade_medium():

    print("🧪 Grading MEDIUM task")

    env = IncidentEnv()

    scenario = "memory_leak"

    result = env.reset(forced_scenario=scenario)

    done = False
    steps = 0
    rewards = []

    while not done and steps < 10:

        # 🔥 AI-based decision
        action_output = run_medium(result.observation.dict())

        action = Action(action=action_output.get("action", "restart_service"))

        result = env.step(action)

        print("➡️ Action:", action.action)
        print("📊 Memory:", result.observation.memory)
        print("📊 Errors:", result.observation.errors)
        print("🏆 Reward:", result.reward)

        rewards.append(result.reward)
        done = result.done
        steps += 1

    # ✅ Efficiency bonus
    if done:
        efficiency_bonus = max(0, (10 - steps) / 10) * 0.2
        rewards.append(efficiency_bonus)

    # ✅ FIX: scenario-based scoring (NOT per step)
    if len(rewards) == 0:
        final_score = 0.0
    else:
        final_score = sum(rewards) / len(rewards)

    # 🔥 OPTIONAL (BEST): make success dominant
    if done:
        final_score = max(final_score, 0.9)

    final_score = round(min(max(final_score, 0.0), 1.0), 2)

    print("\n🎯 MEDIUM SCORE:", final_score)

    return final_score


if __name__ == "__main__":
    grade_medium()