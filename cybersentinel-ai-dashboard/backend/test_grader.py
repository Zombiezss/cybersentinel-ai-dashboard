from backend.graders.grader_easy import grade_easy
from backend.graders.grader_medium import grade_medium
from backend.graders.grader_hard import grade_hard


def run_all_tests():

    print("\n🚀 RUNNING ALL GRADERS\n")

    print("\n========== EASY ==========")
    easy_score = grade_easy()

    print("\n========== MEDIUM ==========")
    medium_score = grade_medium()

    print("\n========== HARD ==========")
    hard_score = grade_hard()

    print("\n==============================")
    print("🎯 FINAL RESULTS")
    print("Easy Score  :", round(easy_score, 2))
    print("Medium Score:", round(medium_score, 2))
    print("Hard Score  :", round(hard_score, 2))


if __name__ == "__main__":
    run_all_tests()