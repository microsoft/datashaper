"""A module for custom exceptions."""


class VerbError(ValueError):
    """Exception for invalid verb input."""

    def __init__(self, message: str):
        super().__init__(message)


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

    def __init__(self, message: str):
        super().__init__(message)


class WorkflowVerbNotFoundError(WorkflowError):
    """Exception for invalid verb input."""

    def __init__(self, verb: str):
        super().__init__(f"Workflow verb not found: {verb}")
