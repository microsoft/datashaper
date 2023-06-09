#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The graph module contains the graph classes used by the datashaper."""

import json
import os

from collections import OrderedDict, defaultdict
from typing import Any, Callable, Dict, List, Optional, Set, Union
from uuid import uuid4

import pandas as pd

from dataclasses import dataclass, field
from jsonschema import validate as validate_schema

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import functions
from datashaper.table_store import TableContainer
from datashaper.types import Verb


# TODO: this won't work for a published package
SCHEMA_FILE = "../../schema/workflow.json"


@dataclass
class ExecutionNode:
    """A data processing node in the execution pipeline."""

    node_id: str
    verb: Callable
    node_input: Union[str, Dict[str, List[str]]]
    args: Dict[str, Any] = field(default_factory=dict)
    result: Optional[TableContainer] = None


class ExecutionGraph:
    """A data processing graph."""

    inputs: Dict[str, TableContainer] = {}
    __graph: Dict[str, ExecutionNode] = OrderedDict()
    __dependency_graph: Dict[str, set] = defaultdict(set)
    __last_step_id: str = None

    def __init__(
        self,
        workflow: Dict,
        input_path: Optional[str] = None,
        input_tables: Optional[Dict[str, pd.DataFrame]] = None,
        schema_path: Optional[str] = SCHEMA_FILE,
        verbs: Optional[Dict[str, Callable]] = functions,
        # TODO: the current schema definition does not work in Python
        validate: bool = False,
    ):
        """Create an execution graph from the Dict provided in workflow.

        :param workflow: the Dict object that contains the workflow
        :type workflow: Dict
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
        """
        # Perform JSON-schema validation
        if validate:
            with open(schema_path) as schema_file:
                schema = json.load(schema_file)
                validate_schema(workflow, schema)

        # Auto-load input tables if provided.
        if input_path is not None:
            for input in workflow["input"]:
                # TODO: support other file formats
                csv_table = pd.read_csv(os.path.join(input_path, f"{input}.csv"))
                self.add_table(input, csv_table)

        if input_tables is not None:
            for input, table in input_tables.items():
                self.add_table(input, table)

        # Create the execution graph
        previous_step_id = None
        for step in workflow["steps"]:
            step_id = step["id"] if "id" in step else str(uuid4())
            step_input = step["input"] if "input" in step else previous_step_id
            verb_fn = None

            try:
                # try to find a built-in verb
                verb_fn = functions[Verb(step["verb"])]
            except ValueError:
                # try to use a custom verb
                verb_fn = verbs[step["verb"]]

            workflow_step = ExecutionNode(
                node_id=step_id,
                node_input=step_input,
                verb=verb_fn,
                args=step["args"] if "args" in step else {},
            )
            self.__graph[step_id] = workflow_step
            for input in ExecutionGraph.__inputs_list(step_input):
                self.__dependency_graph[input].add(step_id)
            previous_step_id = workflow_step.node_id

        self.__last_step_id = previous_step_id

    @staticmethod
    def __inputs_list(input):
        if isinstance(input, str):
            return [input]
        else:
            inputs = []
            for value in input.values():
                if isinstance(value, str):
                    inputs.append(value)
                else:
                    inputs.extend(value)
            return inputs

    def __check_inputs(self, node_key, visitted):
        node = self.__graph[node_key]
        return all(
            [
                input in visitted or input in self.inputs
                for input in self.__inputs_list(node.node_input)
            ]
        )

    def __resolve_inputs(self, inputs):
        if isinstance(inputs, str):
            return {
                "input": VerbInput(
                    input=self.inputs[inputs]
                    if inputs in self.inputs
                    else self.__graph[inputs].result
                )
            }
        else:
            input_mapping = {}
            for key, value in inputs.items():
                if isinstance(value, str):
                    input_mapping[key] = (
                        self.inputs[value]
                        if value in self.inputs
                        else self.__graph[value].result
                    )
                else:
                    input_mapping[key] = [
                        self.inputs[input]
                        if input in self.inputs
                        else self.__graph[input].result
                        for input in value
                    ]
            return {"input": VerbInput(**input_mapping)}

    def add_table(self, id: str, table: pd.DataFrame) -> None:
        """Add a dataframe to the graph with a given id."""
        self.inputs[id] = TableContainer(table=table)

    def output(self, id: Optional[str] = None) -> pd.DataFrame:
        """Get a dataframe from the graph by id."""
        if id is None:
            id = self.__last_step_id

        container: Optional[TableContainer] = self.__graph[id].result
        if container is None:
            raise Exception("Value not calculated yet.")
        else:
            return container.table

    def run(self):
        """Run the execution graph."""
        visited: Set[str] = set()
        executable_nodes = []

        for node_key in self.__graph.keys():
            if self.__check_inputs(node_key, visited):
                executable_nodes.append(node_key)

        while len(executable_nodes) > 0:
            current_id = executable_nodes.pop(0)
            executable_node = self.__graph[current_id]
            result = executable_node.verb(
                **executable_node.args,
                **self.__resolve_inputs(executable_node.node_input),
            )
            executable_node.result = result
            visited.add(current_id)
            for possible in self.__dependency_graph[current_id]:
                if self.__check_inputs(possible, visited):
                    executable_nodes.append(possible)

    def export(self):
        """Export the graph into a workflow JSON object."""
        return {
            "input": [input_name for input_name in self.inputs.keys()],
            "steps": [
                {
                    "id": step.node_id,
                    "verb": step.verb.__name__,
                    "input": step.node_input,
                    "args": step.args,
                }
                for step in self.__graph.values()
            ],
        }
