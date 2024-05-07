import json
import os
from functools import cache
from http.server import HTTPServer, SimpleHTTPRequestHandler
from logging import getLogger
from pathlib import Path
from threading import Thread

import pandas as pd
import pytest
from pandas.testing import assert_frame_equal

from datashaper import PandasDtypeBackend, Workflow, load_csv_table

FIXTURES_PATH = "../../schema/fixtures/workflow/verbs"
TABLE_STORE_PATH = "../../schema/fixtures/workflow_inputs"
SCHEMA_PATH = "../../schema/workflow.json"
log = getLogger(__name__)


server = HTTPServer(("localhost", 8080), SimpleHTTPRequestHandler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()


@cache
def load_inputs():
    dataframes: dict[str, pd.DataFrame] = {}

    for file in os.listdir(TABLE_STORE_PATH):
        path = Path(TABLE_STORE_PATH) / file
        if file.endswith(".csv"):
            table = load_csv_table(path)
            dataframes[file.removesuffix(".csv")] = table
        if file.endswith(".json") and file != "workflow.json":
            table = pd.read_json(path)
            dataframes[file.removesuffix(".json")] = table
    return dataframes



# pandas won't auto-guess iso dates on import, so we define an explicit iso output for comparison as strings
# this means that the expected.csv _must_ match the expected iso format to seconds granularity
def to_csv(df: pd.DataFrame, path: str) -> None:
    df.to_csv(path, date_format="%Y-%m-%dT%H:%M:%SZ", index=False)


def get_verb_test_specs(root: str) -> list[str]:
    subfolders: list[str] = []
    for data_dir, _, files in os.walk(root):
        if "workflow.json" in files:
            subfolders.append(data_dir)
    return subfolders


@pytest.mark.parametrize("fixture_path", get_verb_test_specs(FIXTURES_PATH))
@pytest.mark.parametrize(
    "pandas_dtype_backend",
    [PandasDtypeBackend.NUMPY_NULLABLE],
)
async def test_verbs_schema_input(
    fixture_path: str,
    pandas_dtype_backend: PandasDtypeBackend,
):
    with (Path(fixture_path) / "workflow.json").open() as schema:
        schema_dict = json.load(schema)
        tables: dict[str, pd.DataFrame] = {}
        for input in schema_dict["input"]:
            tables[input] = load_inputs()[input]

        workflow = Workflow(
            schema=schema_dict,
            input_tables=tables,
            validate=True,
            schema_path=SCHEMA_PATH,
            pandas_dtype_backend=pandas_dtype_backend,
        )

    await workflow.run()
    py_path = Path(fixture_path) / "py"
    table_path = str(py_path) if py_path.exists() else fixture_path

    for expected in os.listdir(table_path):
        if expected != "workflow.json" and expected != "comments.txt":
            result_table_path = Path(table_path) / f"result_{expected}"
            expected_table_path = Path(table_path) / expected
            table_name = expected.split(".")[0]
            table_name_arg = table_name

            result = workflow.output(table_name_arg)

            try:
                # if it's a csv we cycle it through file system to confirm read/write
                # TODO: this cycle is outdated and should be removed. it masks potential verbs issues
                if expected.endswith(".csv"):
                    if isinstance(result, pd.DataFrame):
                        to_csv(result, result_table_path)
                    else:
                        to_csv(result.obj, result_table_path)
                    expected_table = load_csv_table(expected_table_path)
                    result_table = load_csv_table(result_table_path)
                elif expected.endswith(".json"):
                    result_table = result
                    expected_table = pd.read_json(expected_table_path)
                assert_frame_equal(
                    expected_table,
                    result_table,
                    check_like=True,
                    check_dtype=False,
                    check_column_type=False,
                )
            except AssertionError:
                print(  # noqa: T201
                    f"Error in {fixture_path}@{expected};\nExpected:\n{expected_table.head()}\n\nActual:\n{result_table.head()}",
                )
                raise
            finally:
                if result_table_path.exists():
                    result_table_path.unlink()
