"""Collection of callbacks that can be used to monitor the workflow execution."""
from typing import Any, Dict, Optional, Protocol

from datashaper.execution.execution_node import ExecutionNode
from datashaper.table_store import TableContainer


class WorkflowCallbacks(Protocol):
    """A collection of callbacks that can be used to monitor the workflow execution."""

    def on_workflow_start(self) -> None:
        """Executes when the workflow starts."""
        ...

    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Executes every time a step starts."""
        ...

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Executes every time a step ends."""
        ...

    def on_workflow_end(self) -> None:
        """Executes when the workflow ends."""
        ...


class NoOpCallbacks:
    def on_workflow_start(self) -> None:
        """Executes when the workflow starts."""
        pass

    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Executes every time a step starts."""
        pass

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Executes every time a step ends."""
        pass

    def on_workflow_end(self) -> None:
        """Executes when the workflow ends."""
        pass
