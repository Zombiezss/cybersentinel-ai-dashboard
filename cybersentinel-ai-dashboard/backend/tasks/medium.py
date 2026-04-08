def run_medium(observation: dict):

    cpu = observation.get("cpu", 0)
    memory = observation.get("memory", 0)
    errors = observation.get("errors", 0)
    logs = observation.get("logs", "").lower()

    # Medium: smarter + uses logs
    if "memory leak" in logs or memory > 90:
        return {"action": "restart_service"}

    if errors > 150:
        return {"action": "block_ip"}

    if cpu > 85:
        return {"action": "scale_up"}

    return {"action": "restart_service"}