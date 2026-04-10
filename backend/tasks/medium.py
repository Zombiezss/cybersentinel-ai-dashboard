import os
import json
from openai import OpenAI


def run_medium(observation: dict):

    cpu = observation.get("cpu", 0)
    memory = observation.get("memory", 0)
    errors = observation.get("errors", 0)
    logs = observation.get("logs", "").lower()

    # ✅ LLM client (IMPORTANT)
    client = OpenAI(
        api_key=os.environ["API_KEY"],
        base_url=os.environ["API_BASE_URL"]
    )

    try:
        prompt = f"""
        You are a DevOps AI assistant.

        System state:
        CPU: {cpu}
        Memory: {memory}
        Errors: {errors}
        Logs: {logs}

        Choose the best action from:
        - scale_up
        - restart_service
        - block_ip

        Respond ONLY in JSON:
        {{"action": "<one_action>"}}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        output = response.choices[0].message.content
        parsed = json.loads(output)

        if parsed.get("action") in ["scale_up", "restart_service", "block_ip"]:
            return parsed

    except Exception as e:
        print("⚠️ LLM failed, fallback:", e)

    # ✅ fallback (your original logic)
    if "memory leak" in logs or memory > 90:
        return {"action": "restart_service"}

    if errors > 150:
        return {"action": "block_ip"}

    if cpu > 85:
        return {"action": "scale_up"}

    return {"action": "restart_service"}
