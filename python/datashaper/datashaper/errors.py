"""A module for custom exceptions."""


class UnsupportedComparisonOperatorError(ValueError):
    """Exception for unsupported comparison operators."""

    def __init__(self, operator: str):
        super().__init__(f"{operator} is not a recognized comparison operator")


class InvalidVerbInputError(ValueError):
    """Exception for invalid verb input."""

    def __init__(self, message: str):
        super().__init__(message)


class WorkflowOutputNotReadyError(RuntimeError):
    """Exception for invalid verb input."""

    def __init__(self, workflow: str, output: str):
        super().__init__(
            f"Workflow output not ready, workflow={workflow}, output={output}"
        )


class VerbComputeError(ValueError):
    """Exception for invalid verb input."""

    def __init__(self, message: str):
        super().__init__(message)
