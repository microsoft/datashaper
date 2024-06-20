"""A module for custom exceptions."""


class VerbError(ValueError):
    """Exception for invalid verb input."""

    def __init__(self, message: str | None = None):
        super().__init__(message or "A verb error occurred")


class VerbOperationNotSupportedError(VerbError):
    """Exception for invalid verb input."""

    def __init__(self):
        super().__init__("Operation not supported")


class VerbParallelizationError(VerbError):
    """Exception for invalid verb input."""

    def __init__(self, num_errors: int):
        super().__init__(
            f"{num_errors} Errors occurred while running parallel transformation, could not complete!"
        )


class VerbAlreadyRegisteredError(VerbError):
    """Exception for invalid verb input."""

    def __init__(self, verb: str):
        super().__init__(f"Verb {verb} already registered.")


class UnsupportedComparisonOperatorError(VerbError):
    """Exception for unsupported comparison operators."""

    def __init__(self, operator: str):
        super().__init__(f"{operator} is not a recognized comparison operator")


class InvalidVerbInputError(VerbError):
    """Exception for invalid verb input."""

    def __init__(self, message: str):
        super().__init__(message)


class WorkflowError(RuntimeError):
    """Exception for invalid verb input."""

    def __init__(self, message: str):
        super().__init__(message)


class WorkflowOutputNotReadyError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, workflow: str, output: str):
        super().__init__(
            f"Workflow output not ready, workflow={workflow}, output={output}"
        )


class WorkflowMissingInputError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, name: str | None = None):
        super().__init__(
            f"Workflow missing input: {name}"
            if name is not None
            else "Workflow missing inputs"
        )


class WorkflowInvalidInputError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, name: str | None = None):
        super().__init__(
            f"Workflow invalid input encountered: {name}"
            if name is not None
            else "Workflow invalid input encountered"
        )


class NodeNotVisitedError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, name: str, verb: str, inputs: list[str]):
        super().__init__(
            f"{verb} node not visited: name='{name}', inputs={','.join(inputs)}"
        )


class WorkflowVerbNotFoundError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, verb: str):
        super().__init__(f"Workflow verb not found: {verb}")
