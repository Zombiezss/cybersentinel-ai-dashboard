import random
from .models import Observation, Action, StepResult


class IncidentEnv:

    def __init__(self):
        self.state_data = {}
        self.done = False
        self.steps = 0
        self.max_steps = 5
        self.root_cause = None
        self.last_action = None

    def reset(self, forced_scenario=None):
        scenarios = ["cpu_overload", "memory_leak", "ddos_attack"]

        self.root_cause = forced_scenario if forced_scenario else random.choice(scenarios)

        if self.root_cause == "cpu_overload":
            self.state_data = {
                "cpu": 95,
                "memory": 60,
                "errors": 200,
                "logs": "High CPU usage detected"
            }

        elif self.root_cause == "memory_leak":
            self.state_data = {
                "cpu": 70,
                "memory": 95,
                "errors": 120,
                "logs": "Memory leak suspected"
            }

        else:  # ddos_attack
            self.state_data = {
                "cpu": 85,
                "memory": 75,
                "errors": 300,
                "logs": "DDoS attack detected"
            }

        self.done = False
        self.steps = 0
        self.last_action = None

        return StepResult(
            observation=Observation(**self.state_data),
            reward=0.0,
            done=False,
            info={"scenario": self.root_cause}
        )

    def step(self, action: Action):

        if not self.state_data:
            return self.reset()

        if action is None or not action.action:
            raise ValueError("Action must be provided")

        self.steps += 1
        action_type = action.action
        self.last_action = action_type

        reward = 0.0

        correct_actions = {
            "cpu_overload": "scale_up",
            "memory_leak": "restart_service",
            "ddos_attack": "block_ip"
        }

        # ✅ Apply action effects (IMPROVED REWARD LOGIC)
        if action_type == correct_actions[self.root_cause]:

            # Faster recovery (improves efficiency score)
            self.state_data["errors"] = max(0, self.state_data["errors"] - 150)
            self.state_data["cpu"] = max(0, self.state_data["cpu"] - 20)
            self.state_data["memory"] = max(0, self.state_data["memory"] - 20)

            if self.state_data["errors"] == 0:
                reward = 1.0
                self.done = True
                self.state_data["logs"] = "🎉 System recovered"
            else:
                reward = 0.85  # strong intermediate reward
                self.state_data["logs"] = f"✅ Correct action: {action_type}"

        else:
            self.state_data["errors"] += 20
            reward = -0.5
            self.state_data["logs"] = f"❌ Wrong action: {action_type}"

        # ✅ Max steps condition (unchanged behavior)
        if self.steps >= self.max_steps and not self.done:
            self.done = True
            reward -= 0.5
            self.state_data["logs"] = "⚠️ Max steps reached"

        reward = max(-1.0, min(1.0, reward))

        return StepResult(
            observation=Observation(**self.state_data),
            reward=round(reward, 2),
            done=self.done,
            info={
                "steps": self.steps,
                "last_action": self.last_action,
                "scenario": self.root_cause
            }
        )

    def state(self):
        return StepResult(
            observation=Observation(**self.state_data),
            reward=0.0,
            done=self.done,
            info={
                "steps": self.steps,
                "scenario": self.root_cause
            }
        )