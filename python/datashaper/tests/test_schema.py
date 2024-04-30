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

from datashaper import PandasDtypeBackend, Workflow

FIXTURES_PATH = "fixtures/workflow"
TABLE_STORE_PATH = "fixtures/workflow_inputs"
SCHEMA_PATH = "workflow.json"
log = getLogger(__name__)
os.chdir("../../schema")


server = HTTPServer(("localhost", 8080), SimpleHTTPRequestHandler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()


@cache
def load_inputs():
    dataframes: dict[str, pd.DataFrame] = {}
    
    for file in os.listdir(TABLE_STORE_PATH):
        path = Path(TABLE_STORE_PATH) / file
        if file.endswith(".csv"):
            table = pd.read_csv(path)
            dataframes[file.removesuffix(".csv")] = table
        if file.endswith(".json") and file != "workflow.json":
            table = pd.read_json(path)
            dataframes[file.removesuffix(".json")] = table
    return dataframes


def read_csv(path: str) -> pd.DataFrame:
    table = pd.read_csv(path)

    if "date" in table.columns:
        table["date"] = pd.to_datetime(table["date"], errors="coerce")
        table["newColumn"] = pd.to_datetime(table["newColumn"], errors="coerce")

    if "json_object" in table.columns:
        table["json_object"] = __conversion_function_map["json_object"](
            table["json_object"]
        )

    return table


__conversion_function_map = {
    "json_object": lambda column: column.apply(
        lambda _x: json.loads(
            str(_x).replace("'", '"').replace('"{"', '{"').replace('"}"}', '"}}')
        )
    ),
}


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
                        result.to_csv(result_table_path, index=False)
                    else:
                        result.obj.to_csv(result_table_path, index=False)
                    expected_table = read_csv(expected_table_path)
                    result_table = read_csv(result_table_path)
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