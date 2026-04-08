def run_hard(observation: dict):

    cpu = observation.get("cpu", 0)
    memory = observation.get("memory", 0)
    errors = observation.get("errors", 0)
    logs = observation.get("logs", "").lower()

    # Hard: priority-based + context-aware

    # 🔴 Highest priority → DDoS
    if "ddos" in logs or "too many requests" in logs or errors > 250:
        return {"action": "block_ip"}

    # 🟠 Memory leak
    if "memory leak" in logs and memory > 85:
        return {"action": "restart_service"}

    # 🟡 CPU overload
    if cpu > 90 or "cpu" in logs:
        return {"action": "scale_up"}

    # Fallback
    return {"action": "block_ip"}