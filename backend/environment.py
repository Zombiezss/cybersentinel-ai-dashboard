import random
import os
from openai import OpenAI
from .models import Observation, Action, StepResult


# ✅ SAFE: create client ONLY when needed
def get_client():
    return OpenAI(
        api_key=os.environ.get("API_KEY"),
        base_url=os.environ.get("API_BASE_URL")
    )


def call_llm(prompt):
    try:
        client = get_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content

    except Exception:
        return None


def decide_action_with_llm(state):
    prompt = f"""
You are a cybersecurity agent.

System state:
CPU: {state['cpu']}
Memory: {state['memory']}
Errors: {state['errors']}
Logs: {state['logs']}

Choose ONE action from:
scale_up, restart_service, block_ip

Only return the action name.
"""

    result = call_llm(prompt)

    if result:
        result = result.strip().lower()

        if result in ["scale_up", "restart_service", "block_ip"]:
            return result

    return None


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

        else:
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
            reward=0.5,  # ✅ MUST NOT be 0.0
            done=False,
            info={"scenario": self.root_cause}
        )

    def step(self, action: Action):

        if not self.state_data:
            return self.reset()

        if action is None or not action.action:
            raise ValueError("Action must be provided")

        self.steps += 1

        llm_action = decide_action_with_llm(self.state_data)

        if llm_action:
            action_type = llm_action
        else:
            action_type = action.action

        self.last_action = action_type

        reward = 0.5  # ✅ default valid value

        correct_actions = {
            "cpu_overload": "scale_up",
            "memory_leak": "restart_service",
            "ddos_attack": "block_ip"
        }

        # ✅ Correct action
        if action_type == correct_actions[self.root_cause]:

            self.state_data["errors"] = max(0, self.state_data["errors"] - 150)
            self.state_data["cpu"] = max(0, self.state_data["cpu"] - 20)
            self.state_data["memory"] = max(0, self.state_data["memory"] - 20)

            if self.state_data["errors"] == 0:
                reward = 0.99   # ✅ NOT 1.0
                self.done = True
                self.state_data["logs"] = "🎉 System recovered"
            else:
                reward = 0.85
                self.state_data["logs"] = f"✅ Correct action: {action_type}"

        # ❌ Wrong action → but keep > 0
        else:
            self.state_data["errors"] += 20
            reward = 0.1   # ✅ NOT 0.0
            self.state_data["logs"] = f"❌ Wrong action: {action_type}"

        # Max steps
        if self.steps >= self.max_steps and not self.done:
            self.done = True
            reward = max(0.01, reward - 0.2)
            self.state_data["logs"] = "⚠️ Max steps reached"

        # ✅ STRICT RANGE (0,1)
        reward = max(0.01, min(0.99, reward))

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
            reward=0.5,  # ✅ NOT 0.0
            done=self.done,
            info={
                "steps": self.steps,
                "scenario": self.root_cause
            }
        )