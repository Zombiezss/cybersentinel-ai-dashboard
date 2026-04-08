from backend.environment import IncidentEnv
from backend.models import Action


def grade_easy():

    print("🚀 Grader started")

    env = IncidentEnv()

    scenarios = ["cpu_overload", "memory_leak", "ddos_attack"]

    correct_action_map = {
        "cpu_overload": "scale_up",
        "memory_leak": "restart_service",
        "ddos_attack": "block_ip"
    }

    scenario_scores = []

    for scenario in scenarios:

        print(f"\n🔍 Testing scenario: {scenario}")

        result = env.reset(forced_scenario=scenario)

        done = False
        steps = 0

        while not done and steps < 10:

            action = Action(action=correct_action_map[scenario])

            result = env.step(action)

            print("➡️ Action:", action.action)
            print("📊 Errors:", result.observation.errors)
            print("🏆 Reward:", result.reward)

            done = result.done
            steps += 1

        # ✅ FIXED: outcome-based scoring (NO averaging issue)
        if done:
            efficiency_bonus = max(0, (10 - steps) / 10) * 0.2
            scenario_score = min(1.0, 0.8 + efficiency_bonus)
        else:
            scenario_score = 0.0

        scenario_scores.append(scenario_score)

    # ✅ FINAL SCORE
    if len(scenario_scores) == 0:
        final_score = 0.0
    else:
        final_score = sum(scenario_scores) / len(scenario_scores)

    final_score = round(min(max(final_score, 0.0), 1.0), 2)

    print("\n📊 Scenario Scores:", [round(s, 2) for s in scenario_scores])
    print("🏁 FINAL NORMALIZED SCORE:", final_score)

    return final_score


if __name__ == "__main__":
    grade_easy()