from pydantic import BaseModel


class Observation(BaseModel):
    cpu: int
    memory: int
    errors: int
    logs: str


class Action(BaseModel):
    action: str


class StepResult(BaseModel):
    observation: Observation
    reward: float
    done: bool
    info: dict