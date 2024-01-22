from typing import Any, Dict, Optional, Protocol

from datashaper.execution.execution_node import ExecutionNode
from datashaper.table_store import TableContainer


class WorkflowCallbacks(Protocol):
    """A collection of callbacks that can be used to monitor the workflow execution."""

    def on_workflow_start(self) -> None:
        """Called when the workflow starts."""
        ...
    
    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Called when a step starts."""
        ...

    def on_step_end(self, node: ExecutionNode, result: Optional[TableContainer]) -> None:
        """Called when a step ends."""
        ...

    def on_workflow_end(self) -> None:
        """Called when the workflow ends."""
        ...


class NoOpCallbacks:
    def on_workflow_start(self) -> None:
        """Called when the workflow starts."""
        pass
    
    def on_step_start(self, node: ExecutionNode, inputs: Dict[str, Any]) -> None:
        """Called when a step starts."""
        pass

    def on_step_end(self, node: ExecutionNode, result: Optional[TableContainer]) -> None:
        """Called when a step ends."""
        pass

    def on_workflow_end(self) -> None:
        """Called when the workflow ends."""
        pass