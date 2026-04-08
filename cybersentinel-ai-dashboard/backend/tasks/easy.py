def run_easy(observation: dict):

    cpu = observation.get("cpu", 0)
    memory = observation.get("memory", 0)
    errors = observation.get("errors", 0)
    logs = observation.get("logs", "").lower()

    # Simple rule-based logic
    if cpu > 85:
        return {"action": "scale_up"}

    if memory > 90:
        return {"action": "restart_service"}

    if errors > 200:
        return {"action": "block_ip"}

    return {"action": "scale_up"}