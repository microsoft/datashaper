"""Memory profiling callbacks."""
import time
import tracemalloc

from collections import defaultdict
from typing import Any, Optional

import pandas as pd

from datashaper import Progress

from ...execution.execution_node import ExecutionNode
from ...table_store import TableContainer
from .workflow_callbacks import WorkflowCallbacks


class MemoryProfilingWorkflowCallbacks(WorkflowCallbacks):
    """Callbacks for memory profiling."""

    _snapshots: dict[str, list]
    _peak_memory: dict[str, list]
    _timing: dict[str, list]
    _peak_memory: dict[str, list]
    _peak_start_workflow: int
    _peak_start_verb: int
    _workflow_start: float
    _verb_start: float

    def __init__(self):
        """Create a new instance of MemoryProfilingWorkflowCallbacks."""
        self._snapshots = defaultdict(list)
        self._peak_memory = defaultdict(list)
        self._timing = defaultdict(list)
        self._peak_memory = defaultdict(list)
        self._peak_start_workflow = 0
        self._peak_start_verb = 0
        self._workflow_start = 0
        self._verb_start = 0

    def on_step_progress(self, node: ExecutionNode, progress: Progress) -> None:
        """A call back handler for when progress occurs."""
        pass

    def on_error(
        self,
        message: str,
        cause: Optional[Exception] = None,
        stack: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> None:
        """A call back handler for when an error occurs."""
        pass

    def on_warning(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a warning occurs."""
        pass

    def on_log(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a log message occurs."""
        pass

    def on_measure(
        self, name: str, value: float, details: Optional[dict] = None
    ) -> None:
        """A call back handler for when a measurement occurs."""
        pass

    def on_workflow_start(self) -> None:
        """Call when the workflow starts."""
        tracemalloc.start()
        _, self._peak_start_workflow = tracemalloc.get_traced_memory()
        self._snapshots["all"].append(tracemalloc.take_snapshot())
        self._workflow_start = time.time()

    def on_step_start(self, node: ExecutionNode, inputs: dict[str, Any]) -> None:
        """Call when a step starts."""
        # reset peak so we can get the peak during the verb execution
        self._snapshots[node.verb.name].append(tracemalloc.take_snapshot())
        _, self._peak_start_verb = tracemalloc.get_traced_memory()
        self._verb_start = time.time()

    def on_step_end(self, node: ExecutionNode, result: TableContainer | None) -> None:
        """Call when a step ends."""
        total_time = time.time() - self._verb_start
        self._timing[node.verb.name].append(total_time)
        self._snapshots[node.verb.name].append(tracemalloc.take_snapshot())
        # Get peak recorded during verb execution
        _, peak = tracemalloc.get_traced_memory()
        self._peak_memory[node.verb.name].append(peak - self._peak_start_verb)

    def on_workflow_end(self) -> None:
        """Call when the workflow ends."""
        total_time = time.time() - self._workflow_start
        self._timing["all"].append(total_time)
        self._snapshots["all"].append(tracemalloc.take_snapshot())
        _, peak = tracemalloc.get_traced_memory()
        self._peak_memory["all"].append(peak - self._peak_start_workflow)
        tracemalloc.stop()

    def get_snapshot_stats(self, sort_by="max"):
        """Get the snapshot stats."""
        stats = {}
        for verb, snapshots in self._snapshots.items():
            verb_stats = []
            for first, second in zip(snapshots[::2], snapshots[1::2]):
                stat_diff = second.compare_to(first, "lineno")
                diff_size = sum(stat.size_diff for stat in stat_diff)
                verb_stats.append(_bytes_to_mb(diff_size))
            stats[verb] = {
                "mean": sum(verb_stats) / len(verb_stats),
                "max": max(verb_stats),
                "min": min(verb_stats),
                "samples": len(verb_stats),
            }
        return pd.DataFrame(stats).transpose().sort_values(sort_by, ascending=False)

    def get_peak_stats(self, sort_by="max"):
        """Get the peak memory stats."""
        stats = {}
        for verb, peak in self._peak_memory.items():
            stats[verb] = {
                "mean": _bytes_to_mb(sum(peak) / len(peak)),
                "max": _bytes_to_mb(max(peak)),
                "min": _bytes_to_mb(min(peak)),
                "samples": len(peak),
            }
        return pd.DataFrame(stats).transpose().sort_values(sort_by, ascending=False)

    def get_time_stats(self, sort_by="max"):
        """Get the time stats."""
        stats = {}
        for verb, times in self._timing.items():
            stats[verb] = {
                "mean": sum(times) / len(times),
                "max": max(times),
                "min": min(times),
                "samples": len(times),
            }
        return pd.DataFrame(stats).transpose().sort_values(sort_by, ascending=False)

    def get_detailed_view(self):
        """Get a detailed view of the memory usage."""
        df_json = defaultdict(list)
        for verb, snapshot in self._snapshots.items():
            for sample, (first, second) in enumerate(
                zip(snapshot[::2], snapshot[1::2])
            ):
                stat_diff = second.compare_to(first, "lineno")
                for stat in stat_diff:
                    df_json["verb"].append(verb)
                    df_json["size_diff"].append(stat.size_diff)
                    df_json["size"].append(stat.size)
                    df_json["count_diff"].append(stat.count_diff)
                    df_json["count"].append(stat.count)
                    df_json["filename"].append(stat.traceback[0].filename)
                    df_json["lineno"].append(stat.traceback[0].lineno)
                    df_json["sample"].append(sample)
        return pd.DataFrame(df_json)


def _bytes_to_mb(bytes):
    """Convert bytes to megabytes."""
    return bytes / 1024**2
