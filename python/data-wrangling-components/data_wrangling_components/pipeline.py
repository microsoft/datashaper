#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import json
import zipfile

from io import StringIO
from typing import Callable, Dict, List, Optional, Protocol

import pandas as pd

from dataclasses import dataclass, field

from data_wrangling_components.engine.verbs.chain import chain
from data_wrangling_components.step_json_encoder import StepJsonEncoder
from data_wrangling_components.table_store import (
    DefaultTableStore,
    Table,
    TableContainer,
    TableStore,
)
from data_wrangling_components.types import Step, Verb


class Pipeline(Protocol):
    def add(self, step: Step):
        ...

    def add_all(self, steps: List[Step]):
        ...

    def add_dataset(
        self,
        name: str,
        dataframe: pd.DataFrame = None,
        path: str = None,
        resolver: Callable[[str], pd.DataFrame] = None,
    ):
        ...

    def get_dataset(self, name: str) -> Table:
        ...

    def save_store(self, zip_path: str) -> None:
        ...

    def load_store(self, zip_path: str) -> None:
        ...

    def clear(self) -> None:
        ...

    def update(self, step: Step, index: int) -> None:
        ...

    def run(self) -> TableContainer:
        ...

    def list_store(self, filter: Optional[str] = None) -> List[str]:
        ...

    def to_json(self) -> str:
        ...


@dataclass
class DefaultPipeline:
    _store: Optional[TableStore] = field(default_factory=DefaultTableStore)
    _steps: Optional[List[Step]] = field(default_factory=list)

    def add(self, step: Step):
        """Adds a new step into the pipeline

        :param step:
            Step to add into the table
        :type step: Step
        """
        self._steps.append(step)

    def add_all(self, steps: List[Step]):
        """Adds a list of new steps into the pipeline

        :param steps:
            Steps to add into the pipeline
        :type steps: List[Step]
        """
        self._steps.extend(steps)

    def add_dataset(
        self,
        name: str,
        dataframe: pd.DataFrame = None,
        path: str = None,
        resolver: Callable[[str], pd.DataFrame] = None,
    ):
        """Loads a dataset into the table store to be used as input

        :param name:
            Name of the table to insert
        :type name: str
        :param dataframe:
            Pandas dataframe to load as input
            If not provided then it will check for a path to load, defaults to None
        :type dataframe: pd.DataFrame, optional
        :param path:
            Path to load a csv file
            Only used if the dataframe argument is not provided, defaults to None
        :type path: str, optional
        :param resolver: Function to load a dataframe given a name
            Only used if dataframe and path are not provided, defaults to None
        :type resolver: Callable[[str], pd.DataFrame], optional
        """
        if dataframe is not None:
            self._store.set(name, TableContainer(id=name, name=name, table=dataframe))
        elif path is not None:
            self._store.set(
                name,
                TableContainer(
                    id=name,
                    name=name,
                    table=pd.read_csv(path, engine="python", on_bad_lines=lambda x: x),
                ),
            )
        elif resolver is not None:
            self._store.queue(name, resolver)

    def get_dataset(self, name: str) -> pd.DataFrame:
        """Retrieves a dataset from the store as a pandas DataFrame

        :param name: name of the dataset to retrieve
        :type name: str
        :return: The pandas DataFrame represented by the name in the store
        :rtype: pd.DataFrame
        """
        return self._store.table(name)

    def save_store(self, zip_path: str):
        """Saves the store into a zip file in the provided path

        :param zip_path:
            Path to zip file, for example: ~/path/to/file.zip
            If the .zip is missing then it will be automatically appended to the path
        :type zip_path: str
        """
        zip_path = f"{zip_path}.zip" if not zip_path.endswith(".zip") else zip_path
        with zipfile.ZipFile(zip_path, "w") as zip_file:
            for key, value in self._store.to_map().items():
                key = f"{key}.csv" if not key.endswith(".csv") else key
                zip_file.writestr(key, value.to_csv(index=False))

    def load_store(self, zip_path: str):
        zip_path = f"{zip_path}.zip" if not zip_path.endswith(".zip") else zip_path
        with zipfile.ZipFile(zip_path, "r") as zip_file:
            for zip_info in zip_file.infolist():
                file_bytes = zip_file.read(zip_info)
                file_name = zip_info.filename.split(".")[0]
                self._store.set(
                    file_name,
                    TableContainer(
                        id=file_name,
                        name=file_name,
                        table=pd.DataFrame(StringIO(file_bytes.decode("utf-8"))),
                    ),
                )

    def clear(self):
        """Clears all stored tables in the store"""
        for step in self._steps:
            self._store.delete(step.output)
        self._steps = []

    def update(self, step: Step, index: int):
        """Updates a step in a particular index of the pipeline

        :param step:
            Updated step
        :type step: Step
        :param index:
            Index of the step to replace
        :type index: int
        """
        self._steps[index] = step

    def run(self):
        """Runs the pipeline steps

        :raises e: Exception if any of the steps in the pipeline fails
        """
        return chain(
            Step(
                verb=Verb.Chain,
                input=self._steps[0].input,
                output=self._steps[-1].output,
                args={"steps": self._steps, "nofork": True},
            ),
            self._store,
        )

    def list_store(self, filter: Optional[str] = None) -> List[str]:
        """Lists all tables stored in the pipeline table store

        :param filter:
            Optional filter to reduce the amount of tables listed, defaults to None
        :type filter: Optional[str], optional
        :return:
            The list of table names stored in the store
        :rtype: List[str]
        """
        return self._store.list(filter)

    def __len__(self):
        return len(self._steps)

    def to_json(self, file_path: str = None, indent: int = None) -> str:
        """Creates a json representation of the steps in the pipeline

        :param file_path:
            Filepath to store the result, defaults to None
        :type file_path: str, optional
        :param indent:
            Indent to add to the json representation, defaults to None
        :type indent: int, optional
        :return: The JSON as a string
        :rtype: str
        """
        if file_path is None:
            return json.dumps(
                {"steps": self._steps}, cls=StepJsonEncoder, indent=indent
            )
        else:
            with open(file_path, "w") as json_file:
                json.dump(
                    {"steps": self._steps},
                    json_file,
                    indent=indent,
                    cls=StepJsonEncoder,
                )

    @staticmethod
    def from_json(steps: List[Dict], store: TableStore = None) -> "Pipeline":
        """Reads a json loaded as a Dict and creates a new pipeline

        :param steps:
            List of steps that describe the new pipeline
        :type steps: List[Dict]
        :param store:
            The tableStore to use, if None a new one will be created, defaults to None
        :type store: TableStore, optional
        :return: A new Pipeline
        :rtype: Pipeline
        """
        if store is None:
            store = DefaultTableStore()
        new_pipeline = DefaultPipeline(store)
        for step in steps:
            new_pipeline.add(
                Step(
                    verb=Verb(step["verb"]),
                    input=step["input"],
                    output=step["output"],
                    args=step["args"],
                )
            )
        return new_pipeline
