from backend.environment import IncidentEnv
from backend.models import Action
from backend.tasks.hard import run_hard


def grade_hard():

    print("🧪 Grading HARD task")

    env = IncidentEnv()

    scenario = "ddos_attack"

    result = env.reset(forced_scenario=scenario)

    done = False
    steps = 0
    rewards = []

    while not done and steps < 12:

        # 🔥 AI decision
        action_output = run_hard(result.observation.dict())

        action = Action(action=action_output.get("action", "block_ip"))

        result = env.step(action)

        print("➡️ Action:", action.action)
        print("📊 Network Errors:", result.observation.errors)
        print("🏆 Reward:", result.reward)

        rewards.append(result.reward)

        # ✅ keep penalty (safe)
        if action.action != "block_ip":
            rewards.append(-0.1)

        done = result.done
        steps += 1

    # ✅ Efficiency bonus
    if done:
        efficiency_bonus = max(0, (12 - steps) / 12) * 0.2
        rewards.append(efficiency_bonus)

    # ✅ Penalty if not solved
    if not done:
        rewards.append(-0.3)

    # ✅ FIX: outcome-dominant scoring
    if len(rewards) == 0:
        final_score = 0.0
    else:
        final_score = sum(rewards) / len(rewards)

    # 🔥 CRITICAL FIX: reward success properly
    if done:
        final_score = max(final_score, 0.9)

    final_score = round(min(max(final_score, 0.0), 1.0), 2)

    print("\n🎯 HARD SCORE:", final_score)

    return final_score


if __name__ == "__main__":
    grade_hard()