#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The data processing workflow definition."""

import asyncio
import inspect
import json
import os
import time
import traceback

from collections import OrderedDict, defaultdict
from typing import Any, Callable, Generic, Optional, Protocol, TypeVar
from uuid import uuid4

import pandas as pd

from jsonschema import validate as validate_schema

from datashaper.engine.verbs import VerbDetails, VerbInput, VerbManager
from datashaper.execution import ExecutionNode
from datashaper.progress.reporters import (
    NoopStatusReporter,
    StatusReporter,
    VerbStatusReporter,
)
from datashaper.progress.types import ProgressStatus, StatusReportHandler
from datashaper.table_store import Table, TableContainer


# TODO: this won't work for a published package
SCHEMA_FILE = "../../schema/workflow.json"

Context = TypeVar("Context")

DEFAULT_INPUT_NAME = "datasource"


class WorkflowCallbacks(Protocol):
    """A collection of callbacks that can be used to monitor the workflow execution."""

    def on_workflow_start(self) -> None:
        """Called when the workflow starts."""
        ...
    
    def on_step_start(self, node: ExecutionNode) -> None:
        """Called when a step starts."""
        ...

    def on_step_end(self, node: ExecutionNode) -> None:
        """Called when a step ends."""
        ...

    def on_workflow_end(self) -> None:
        """Called when the workflow ends."""
        ...


class NoOpCallbacks:
    def on_workflow_start(self) -> None:
        """Called when the workflow starts."""
        pass
    
    def on_step_start(self, node: ExecutionNode) -> None:
        """Called when a step starts."""
        pass

    def on_step_end(self, node: ExecutionNode) -> None:
        """Called when a step ends."""
        pass

    def on_workflow_end(self) -> None:
        """Called when the workflow ends."""
        pass

def _create_default_verb_status_reporter(name: str) -> StatusReportHandler:
    return lambda progress: None


class Workflow(Generic[Context]):
    """A data processing graph."""

    _schema: dict[str, Any]
    _inputs: dict[str, TableContainer]
    _graph: dict[str, ExecutionNode]
    _dependency_graph: dict[str, set]
    _last_step_id: str
    _dependencies: set[str]

    """Externals that this workflow depends on"""

    def __init__(
        self,
        schema: dict[str, Any],
        input_path: Optional[str] = None,
        input_tables: Optional[dict[str, pd.DataFrame]] = None,
        schema_path: Optional[str] = SCHEMA_FILE,
        verbs: Optional[dict[str, Callable]] = None,
        # TODO: the current schema definition does not work in Python
        validate: bool = False,
        default_input: Optional[str] = DEFAULT_INPUT_NAME,
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
        self._schema = schema
        self._dependencies = self._compute_dependencies()
        self._dependency_graph = defaultdict(set)
        self._graph = OrderedDict()
        self._inputs = {}

        # Perform JSON-schema validation
        if validate and schema_path is not None:
            with open(schema_path) as schema_file:
                schema_json = json.load(schema_file)
                validate_schema(schema, schema_json)

        # Auto-load input tables if provided.
        if input_path is not None:
            for input in schema["input"]:
                # TODO: support other file formats
                csv_table = pd.read_csv(os.path.join(input_path, f"{input}.csv"))
                self.add_table(input, csv_table)

        if input_tables is not None:
            for input, table in input_tables.items():
                self.add_table(input, table)

        if verbs is not None:
            VerbManager.get().register_verbs(verbs, override_existing=True)

        # Create the execution graph
        previous_step_id = None
        for step in schema["steps"]:
            step_has_defined_id = "id" in step
            step_id = step["id"] if step_has_defined_id else str(uuid4())
            step_input = (
                step["input"] if "input" in step else previous_step_id
            ) or default_input
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

        self._last_step_id = previous_step_id

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

    @staticmethod
    def __resolve_run_context(
        exec_node: ExecutionNode,
        context: Optional[Context],
        reporter: VerbStatusReporter,
    ) -> dict[str, Any]:
        """Injects the run context into the workflow steps."""

        def argument_names(fn):
            return inspect.getfullargspec(fn).args

        verb_args = argument_names(exec_node.verb.func)
        run_ctx: dict[str, Any] = {}
        progress: StatusReportHandler = lambda progress: reporter.progress(progress)

        # Pass in individual context items
        if context is not None:
            for context_key in dir(context):
                if context_key in verb_args and context_key not in exec_node.args:
                    run_ctx[context_key] = getattr(context, context_key)

        # Pass in the top-level context
        if "context" in verb_args and "context" not in exec_node.args:
            run_ctx["context"] = context

        # Pass in the verb reporter
        if "reporter" in verb_args and "reporter" not in exec_node.args:
            run_ctx["reporter"] = reporter

        # Pass in the progress
        if "progress" in verb_args and "progress" not in exec_node.args:
            run_ctx["progress"] = progress

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
        self, verb: VerbDetails, inputs: str | dict[str, str | list[str]]
    ) -> dict[str, Any]:
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

            if use_original_table:
                return table_container
            else:
                table = table_container.table.copy()
                return TableContainer(table=table)

        if isinstance(inputs, str):
            return {"input": VerbInput(input=input_table(inputs))}
        else:
            input_mapping: dict[str, TableContainer | list[TableContainer]] = {}
            for key, value in inputs.items():
                if isinstance(value, str):
                    input_mapping[key] = input_table(value)
                else:
                    input_mapping[key] = [input_table(t) for t in value]
            return {"input": VerbInput(**input_mapping)}

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
                f"Value not calculated yet. {self.name}: {self._graph[id].verb.__name__} ."
            )
        else:
            return container.table
        

    def run(
        self,
        context: Optional[Context] = None,
        status_reporter: Optional[StatusReporter] = NoopStatusReporter(),
        on_verb_timing: Optional[Callable[[str, float], None]] = None,
        create_verb_progress_reporter: Optional[
            Callable[[str], StatusReportHandler]
        ] = _create_default_verb_status_reporter,
        workflow_callbacks: WorkflowCallbacks = None,
    ) -> None:
        """Run the execution graph."""
        visited: set[str] = set()
        nodes: list[ExecutionNode] = []


        if workflow_callbacks is None:
            workflow_callbacks = NoOpCallbacks()

        workflow_callbacks.on_workflow_start()

        for node_key in self._graph.keys():
            if self._check_inputs(node_key, visited):
                nodes.append(node_key)

        verb_idx = 0

        while len(nodes) > 0:
            current_id = nodes.pop(0)
            node = self._graph[current_id]
            verb_name = node.verb.name

            workflow_callbacks.on_step_start(node)

            # set up verb progress reporter
            progress = create_verb_progress_reporter(f"verb: {verb_name}")
            verb_reporter = VerbStatusReporter(
                f"{self.name}.{verb_name}.{verb_idx}", status_reporter, progress
            )
            progress(ProgressStatus(progress=0))
            start_verb_time = time.time()

            # execute the verb
            try:
                inputs = self._resolve_inputs(node.verb, node.node_input)
                verb_context = Workflow.__resolve_run_context(
                    node, context, verb_reporter
                )
                result = node.verb.func(**node.args, **inputs, **verb_context)
            except Exception as e:
                message = f'Error executing verb "{verb_name}" in {self.name}: {e}'
                status_reporter.error(message, traceback.format_exc())
                raise e

            if inspect.iscoroutine(result):
                result = asyncio.run(result)

            # Record Verb Timing
            if on_verb_timing is not None:
                on_verb_timing(
                    f"verb_{verb_name}_{verb_idx}", time.time() - start_verb_time
                )

            progress(ProgressStatus(progress=1))
            node.result = result

            workflow_callbacks.on_step_end(node)

            # move to the next verb
            visited.add(current_id)
            for possible in self._dependency_graph[current_id]:
                if self._check_inputs(possible, visited):
                    nodes.append(possible)
            verb_idx += 1

        for node_id in self._graph.keys():
            if node_id not in visited:
                if not self._check_inputs(node_id, visited):
                    raise ValueError(f"Missing inputs for node {node_id}!")
                
        workflow_callbacks.on_workflow_end()

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
