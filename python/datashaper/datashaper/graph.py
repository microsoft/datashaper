#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import json
import os

from collections import OrderedDict, defaultdict
from typing import Any, Callable, Dict, List, Optional, Set, Union
from uuid import uuid4

import pandas as pd

from dataclasses import dataclass, field
from jsonschema import validate

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import functions
from datashaper.table_store import TableContainer
from datashaper.types import Verb


SCHEMA_FILE = "../../schema/workflow.json"


@dataclass
class ExecutionNode:
    node_id: str
    verb: Callable
    node_input: Union[str, Dict[str, List[str]]]
    args: Dict[str, Any] = field(default_factory=dict)
    result: Optional[TableContainer] = None


class ExecutionGraph:
    inputs: Dict[str, TableContainer] = {}
    outputs: List[str] = []
    __graph: Dict[str, ExecutionNode] = OrderedDict()
    __dependency_graph: Dict[str, set] = defaultdict(set)

    def __init__(
        self, workflow: Dict, input_path: str = "", schema_path: str = SCHEMA_FILE
    ):
        """Creates an execution graph from the Dict provided in workflow

        :param workflow: the Dict object that contains the workflow
        :type workflow: Dict
        :param input_path: Optional input path, if provided input
                           tables will be loaded relative to that path, defaults to ""
        :type input_path: str, optional
        """
        with open(schema_path) as schema_file:
            schema = json.load(schema_file)
        validate(workflow, schema)

        for input in workflow["input"]:
            self.inputs[input] = TableContainer(
                table=pd.read_csv(os.path.join(input_path, f"{input}.csv"))
            )
        self.outputs = workflow["output"]

        previous_step_id = None
        for step in workflow["steps"]:
            step_id = step["id"] if "id" in step else str(uuid4())
            step_input = step["input"] if "input" in step else previous_step_id
            workflow_step = ExecutionNode(
                node_id=step_id,
                node_input=step_input,
                verb=functions[Verb(step["verb"])],
                args=step["args"] if "args" in step else {},
            )
            self.__graph[step_id] = workflow_step
            for input in ExecutionGraph.__inputs_list(step_input):
                self.__dependency_graph[input].add(step_id)
            previous_step_id = workflow_step.node_id

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

    def get(self, id: str) -> pd.DataFrame:
        container: Optional[TableContainer] = self.__graph[id].result
        if container is None:
            raise Exception("Value not calculated yet.")
        else:
            return container.table

    def run(self):
        visitted: Set[str] = set()
        executable_nodes = []

        for node_key in self.__graph.keys():
            if self.__check_inputs(node_key, visitted):
                executable_nodes.append(node_key)

        while len(executable_nodes) > 0:
            current_id = executable_nodes.pop(0)
            executable_node = self.__graph[current_id]
            result = executable_node.verb(
                **executable_node.args,
                **self.__resolve_inputs(executable_node.node_input),
            )
            executable_node.result = result
            visitted.add(current_id)
            for possible in self.__dependency_graph[current_id]:
                if self.__check_inputs(possible, visitted):
                    executable_nodes.append(possible)

    def export(self):
        return {
            "input": [input_name for input_name in self.inputs.keys()],
            "output": self.outputs,
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
