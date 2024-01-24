"""Collection of callbacks that can be used to monitor the workflow execution."""
from typing import Any, Dict, Optional, Protocol

from datashaper.execution.execution_node import ExecutionNode
from datashaper.table_store import TableContainer


class WorkflowCallbacks(Protocol):
    """A collection of callbacks that can be used to monitor the workflow execution."""

    def on_workflow_start(self) -> None:
        """Execute this callback when a workflow starts."""
        ...

    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Execute this callback every time a step starts."""
        ...

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Execute this callback every time a step ends."""
        ...

    def on_workflow_end(self) -> None:
        """Execute this callback when a workflow ends."""
        ...


class NoOpCallbacks:
    """A collection of callbacks that do nothing."""

    def on_workflow_start(self) -> None:
        """Execute this callback when a workflow starts."""
        pass

    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Execute this callback every time a step starts."""
        pass

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Execute this callback every time a step ends."""
        pass

    def on_workflow_end(self) -> None:
        """Execute this callback when a workflow ends."""
        pass
