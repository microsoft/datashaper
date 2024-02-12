"""Memory profiling callbacks."""
import time
import tracemalloc
from collections import defaultdict

import pandas as pd

from datashaper.execution.execution_node import ExecutionNode
from datashaper.table_store.types import TableContainer

from .noop_workflow_callback import NoopWorkflowCallbacks


class MemoryProfilingWorkflowCallbacks(NoopWorkflowCallbacks):
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

    def on_workflow_start(self, name: str, instance: object) -> None:
        """Call when the workflow starts."""
        tracemalloc.start()
        _, self._peak_start_workflow = tracemalloc.get_traced_memory()
        self._snapshots["all"].append(tracemalloc.take_snapshot())
        self._workflow_start = time.time()

    def on_step_start(self, node: ExecutionNode, inputs: dict) -> None:
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

    def on_workflow_end(self, name: str, instance: object) -> None:
        """Call when the workflow ends."""
        total_time = time.time() - self._workflow_start
        self._timing["all"].append(total_time)
        self._snapshots["all"].append(tracemalloc.take_snapshot())
        _, peak = tracemalloc.get_traced_memory()
        self._peak_memory["all"].append(peak - self._peak_start_workflow)
        tracemalloc.stop()

    def get_snapshot_stats(self, sort_by: str = "max") -> pd.DataFrame:
        """Get the snapshot stats."""
        stats = {}
        for verb, snapshots in self._snapshots.items():
            verb_stats = []
            for first, second in zip(snapshots[::2], snapshots[1::2], strict=True):
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

    def get_peak_stats(self, sort_by: str = "max") -> pd.DataFrame:
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

    def get_time_stats(self, sort_by: str = "max") -> pd.DataFrame:
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

    def get_detailed_view(self) -> pd.DataFrame:
        """Get a detailed view of the memory usage."""
        df_json = defaultdict(list)
        for verb, snapshot in self._snapshots.items():
            for sample, (first, second) in enumerate(
                zip(snapshot[::2], snapshot[1::2], strict=True)
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


def _bytes_to_mb(bytes: float) -> float:
    """Convert bytes to megabytes."""
    return bytes / 1024**2
