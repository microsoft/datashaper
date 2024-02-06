#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The data processing workflow definition."""

import inspect
import json
import os
import time
import traceback

from collections import OrderedDict, defaultdict
from typing import Any, Callable, Generic, Iterable, Optional, TypeVar, cast
from uuid import uuid4

import pandas as pd

from jsonschema import validate as validate_schema

from datashaper.engine.verbs import VerbDetails, VerbInput, VerbManager
from datashaper.execution.execution_node import ExecutionNode
from datashaper.progress.types import Progress
from datashaper.table_store import Table, TableContainer

from .types import MemoryProfile, VerbTiming, WorkflowRunResult
from .verb_callbacks import DelegatingVerbCallbacks
from .workflow_callbacks import (
    MemoryProfilingWorkflowCallbacks,
    WorkflowCallbacks,
    WorkflowCallbacksManager,
)


# TODO: this won't work for a published package
SCHEMA_FILE = "../../schema/workflow.json"

Context = TypeVar("Context")

DEFAULT_INPUT_NAME = "source"


class Workflow(Generic[Context]):
    """A data processing graph."""

    _schema: dict[str, Any]
    _inputs: dict[str, TableContainer]
    _graph: dict[str, ExecutionNode]
    _dependency_graph: dict[str, set[str]]
    _last_step_id: str
    _dependencies: set[str]
    _memory_profile: bool | None
    _validate_schema: bool | None
    _schema_path: str | None

    """Externals that this workflow depends on"""

    def __init__(
        self,
        schema: dict[str, Any],
        input_path: Optional[str] = None,
        input_tables: Optional[dict[str, Table]] = None,
        schema_path: Optional[str] = None,
        verbs: Optional[dict[str, Callable]] = None,
        validate: Optional[bool] = False,
        memory_profile: Optional[bool] = False,
    ):
        """Create an execution graph from the Dict provided in workflow.

        :param schema: the Dict object that contains the workflow
        :type schema: Dict
        :param input_path: Optional input path, if provided input
                           tables will be loaded relative to that path, defaults to None
        :type input_path: str, optional
        :param schema_path: Optional Workflow schema path, if provided input
                           tables will be loaded relative to that path, defaults to
                           a known JSON schema path.
        :type schema_path: str, optional
        :param validate: Optional value, if true perform JSON-schema validation.
                         Defaults to False.
        :type validate: bool, optional

        :param default_input: Optional value, the default input for the first step.
        :type default_input: str, optional
        """
        self._schema_path = schema_path or SCHEMA_FILE
        self._schema = schema
        self._memory_profile = memory_profile
        self._dependencies = self._compute_dependencies()
        self._dependency_graph = defaultdict(set)
        self._graph = OrderedDict()
        self._inputs = {}
        self._validate_schema = validate

        # Perform JSON-schema validation
        # TODO: the current schema definition does not work in Python
        if validate and self._schema_path is not None:
            with open(self._schema_path) as schema_file:
                schema_json = json.load(schema_file)
                validate_schema(schema, schema_json)

        # Auto-load input tables if provided.
        if input_path is not None:
            for input in schema["input"]:
                # TODO: support other file formats
                csv_table = pd.read_csv(
                    os.path.join(input_path, f"{input}.csv"), engine="pyarrow"
                )
                self.add_table(input, csv_table)

        if input_tables is not None:
            for input, table in input_tables.items():
                self.add_table(input, table.convert_dtypes(dtype_backend="pyarrow"))

        if verbs is not None:
            VerbManager.get().register_verbs(verbs, override_existing=True)

        # Create the execution graph
        previous_step_id = None
        for step in schema["steps"]:
            step_has_defined_id = "id" in step
            step_id = step["id"] if step_has_defined_id else str(uuid4())
            step_input = (
                step["input"] if "input" in step else previous_step_id
            ) or DEFAULT_INPUT_NAME
            verb = Workflow.__get_verb(step["verb"])

            step = ExecutionNode(
                node_id=step_id,
                node_input=step_input,
                verb=verb,
                has_explicit_id=step_has_defined_id,
                args=step["args"] if "args" in step else {},
            )
            self._graph[step_id] = step
            for input in Workflow.__inputs_list(step_input):
                self._dependency_graph[input].add(step_id)
            previous_step_id = step.node_id

        self._last_step_id = cast(str, previous_step_id)

    def derive(
        self, schema: dict[str, Any], input_tables: dict[str, Table]
    ) -> "Workflow":
        """Derive a new workflow from the current one."""
        # Verbs are already registered, and we don't need to validate the schema again
        return Workflow(
            schema, input_tables=input_tables, validate=self._validate_schema
        )

    @property
    def name(self) -> str:
        """Get the name of the workflow, inferred from the schema json input."""
        return self._schema.get("name", "Workflow")

    @property
    def dependencies(self) -> set[str]:
        """Get the dependencies of the workflow."""
        return self._dependencies

    def _compute_dependencies(self) -> set[str]:
        deps: set[str] = set()
        known: set[str] = set()
        steps: list[dict] = self._schema["steps"]

        if len(steps) > 0:
            if "input" not in steps[0]:
                deps.add(DEFAULT_INPUT_NAME)

            for step in self._schema["steps"]:
                if "id" in step:
                    known.add(step["id"])

                if "input" in step:
                    step_input = step["input"]
                    if isinstance(step_input, str):
                        deps.add(step_input)
                    else:
                        deps.add(step_input["source"])
                        if "others" in step_input:
                            for e in step_input["others"]:
                                deps.add(e)
                        if "depends_on" in step_input:
                            for e in step_input["depends_on"]:
                                deps.add(e)

        # Remove known steps from dep list
        return deps.difference(known)

    @staticmethod
    def __inputs_list(input: str | dict[str, Any] | None) -> list[str]:
        if isinstance(input, str):
            return [input]
        else:
            inputs = []
            if input is not None:
                for value in input.values():
                    if isinstance(value, str):
                        inputs.append(value)
                    else:
                        inputs.extend(value)
            return inputs

    @staticmethod
    def __get_verb(verb: str) -> VerbDetails:
        """Get the verb function from the name."""
        verbs_manager = VerbManager.get()
        result = verbs_manager.get_verb(verb)
        if result is None:
            raise ValueError(f"Verb {verb} not found in verbs")
        return result

    def _resolve_run_context(
        self,
        exec_node: ExecutionNode,
        context: Optional[Context],
        workflow_callbacks: WorkflowCallbacks,
    ) -> dict[str, Any]:
        """Injects the run context into the workflow steps."""
        callbacks = DelegatingVerbCallbacks(exec_node, workflow_callbacks)

        def argument_names(fn):
            return inspect.getfullargspec(fn).args

        verb_args = argument_names(exec_node.verb.func)
        run_ctx: dict[str, Any] = {}

        # Pass in individual context items
        if context is not None:
            for context_key in dir(context):
                if context_key in verb_args and context_key not in exec_node.args:
                    run_ctx[context_key] = getattr(context, context_key)

        # Pass in the top-level context
        if "context" in verb_args and "context" not in exec_node.args:
            run_ctx["context"] = context

        # Pass in the verb callbacks
        if "callbacks" in verb_args and "callbacks" not in exec_node.args:
            run_ctx["callbacks"] = callbacks

        if (
            "workflow_instance" in verb_args
            and "workflow_instance" not in exec_node.args
        ):
            run_ctx["workflow_instance"] = self

        return run_ctx

    def _check_inputs(self, node_key: str, visited: set[str]):
        node = self._graph[node_key]
        return all(
            [
                input in visited or input in self._inputs
                for input in Workflow.__inputs_list(node.node_input)
            ]
        )

    def _resolve_inputs(
        self, verb: VerbDetails, inputs: str | dict[str, list[str]]
    ) -> VerbInput:
        def input_table(name: str) -> TableContainer:
            graph_node = self._graph[name] if name in self._graph else None
            step_table_is_safe_to_mutate = (
                graph_node is not None and not graph_node.has_explicit_id
            )

            # if the node has an explicit id or if the verb is mutation-free, skip the copy
            #
            # NOTE: if this is an input table, we can probably use the original table if this is the only reference in the workflow ... TODO
            #
            use_original_table = (
                verb.treats_input_tables_as_immutable or step_table_is_safe_to_mutate
            )

            # pick either the input table or the original table
            table_container = (
                self._inputs[name] if name in self._inputs else self._graph[name].result
            )

            if table_container is None:
                raise ValueError(f"Input table {name} not found in inputs or graph")
            if use_original_table:
                return table_container
            else:
                table = table_container.table.copy()
                return TableContainer(table=table)

        if isinstance(inputs, str):
            return VerbInput(input=input_table(inputs))
        else:
            input_mapping: dict[str, TableContainer | list[TableContainer]] = {}
            for key, value in inputs.items():
                if isinstance(value, str):
                    input_mapping[key] = input_table(value)
                else:
                    input_mapping[key] = [input_table(t) for t in value]
            return VerbInput(**cast(Any, input_mapping))

    def add_table(self, id: str, table: pd.DataFrame) -> None:
        """Add a dataframe to the graph with a given id."""
        self._inputs[id] = TableContainer(table=table)

    def output(self, id: Optional[str] = None) -> Table:
        """Get a dataframe from the graph by id."""
        if id is None:
            id = self._last_step_id

        container: Optional[TableContainer] = self._graph[id].result
        if container is None:
            raise Exception(
                f"Value not calculated yet. {self.name}: {self._graph[id].verb.name} ."
            )
        else:
            return container.table

    async def run(
        self,
        context: Optional[Context] = None,
        callbacks: Optional[WorkflowCallbacks] = None,
    ) -> WorkflowRunResult:
        """Run the execution graph."""
        visited: set[str] = set()
        nodes: list[str] = []

        def enqueue_available_nodes(possible_nodes: Iterable[str]) -> None:
            for possible_node in possible_nodes:
                if self._check_inputs(possible_node, visited):
                    nodes.append(possible_node)

        def assert_all_visited() -> None:
            for node_id in self._graph.keys():
                if node_id not in visited:
                    if not self._check_inputs(node_id, visited):
                        raise ValueError(f"Missing inputs for node {node_id}!")

        # Use the ensuring variant to guarantee that all protocol methods are available
        callbacks, profiler = self._get_workflow_callbacks(callbacks)
        callbacks.on_workflow_start(self.name, self)
        enqueue_available_nodes(self._graph.keys())

        verb_idx = 0
        verb_timings: list[VerbTiming] = []
        while len(nodes) > 0:
            current_id = nodes.pop(0)
            node = self._graph[current_id]
            timing = await self._execute_verb(node, context, callbacks)
            verb_timings.append(
                VerbTiming(
                    id=node.node_id,
                    verb=node.verb.name,
                    index=verb_idx,
                    timing=timing,
                )
            )

            # move to the next verb
            visited.add(current_id)
            enqueue_available_nodes(self._dependency_graph[current_id])
            verb_idx += 1

        assert_all_visited()
        callbacks.on_workflow_end(self.name, self)

        return WorkflowRunResult(
            verb_timings=verb_timings, memory_profile=_get_memory_profile(profiler)
        )

    async def _execute_verb(
        self,
        node: ExecutionNode,
        context: Optional[Context],
        callbacks: WorkflowCallbacks,
    ) -> float:
        start_verb_time = time.time()

        result = None
        try:
            verb_context = self._resolve_run_context(node, context, callbacks)
            node_input: dict = {
                **node.args,
                "input": self._resolve_inputs(node.verb, node.node_input),
                **verb_context,
            }
            if node.args["input"] is not None:
                node_input["input_arg"] = node.args["input"]

            callbacks.on_step_start(node, node_input)
            callbacks.on_step_progress(node, Progress(percent=0))
            result = node.verb.func(**node_input)

            # Unroll the result if it's a coroutine
            # (we need to do this before calling on_step_end)
            if inspect.iscoroutine(result):
                result = await result
        except Exception as e:
            message = f'Error executing verb "{node.verb.name}" in {self.name}: {e}'
            callbacks.on_error(message, e, traceback.format_exc())
            raise e
        finally:
            callbacks.on_step_progress(node, Progress(percent=1))
            callbacks.on_step_end(node, None)

        node.result = result

        # Return verb timing
        return time.time() - start_verb_time

    def _get_workflow_callbacks(
        self, callbacks: WorkflowCallbacks | None
    ) -> tuple[WorkflowCallbacks, MemoryProfilingWorkflowCallbacks | None]:
        profiler: MemoryProfilingWorkflowCallbacks | None = None
        callback_handler = WorkflowCallbacksManager()

        if callbacks is not None:
            callback_handler.register(callbacks)

        if self._memory_profile:
            profiler = MemoryProfilingWorkflowCallbacks()
            callback_handler.register(profiler)

        return (callback_handler, profiler)

    def export(self):
        """Export the graph into a workflow JSON object."""
        return {
            "input": [input_name for input_name in self._inputs.keys()],
            "steps": [
                {
                    "id": step.node_id,
                    "verb": step.verb.name,
                    "input": step.node_input,
                    "args": step.args,
                }
                for step in self._graph.values()
            ],
        }


def _get_memory_profile(
    profile: MemoryProfilingWorkflowCallbacks | None,
) -> MemoryProfile | None:
    if profile is not None:
        return MemoryProfile(
            snapshot_stats=profile.get_snapshot_stats(),
            peak_stats=profile.get_peak_stats(),
            time_stats=profile.get_time_stats(),
            detailed_view=profile.get_detailed_view(),
        )
    else:
        return None
