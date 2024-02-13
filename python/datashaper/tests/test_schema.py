import json
import os
from functools import cache
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from logging import getLogger

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
def load_inputs(pandas_dtype_backend: PandasDtypeBackend, engine: str):
    dataframes: dict[str, pd.DataFrame] = {}
    for file in os.listdir(TABLE_STORE_PATH):
        if file.endswith(".csv"):
            path = Path(TABLE_STORE_PATH) / file
            table = pd.read_csv(
                path,
                dtype_backend=pandas_dtype_backend,
                engine=engine,
            )
            dataframes[file.removesuffix(".csv")] = table
    return dataframes


def read_csv(path: str) -> pd.DataFrame:
    table = pd.read_csv(path)

    if "date" in table.columns:
        table["date"] = pd.to_datetime(table["date"], errors="coerce")
        table["newColumn"] = pd.to_datetime(table["newColumn"], errors="coerce")

    return table


def get_verb_test_specs(root: str) -> list[str]:
    subfolders: list[str] = []
    for data_dir, _, files in os.walk(root):
        if "workflow.json" in files:
            subfolders.append(data_dir)
    return subfolders


@pytest.mark.parametrize("fixture_path", get_verb_test_specs(FIXTURES_PATH))
@pytest.mark.parametrize(
    "pandas_dtype_backend",
    [PandasDtypeBackend.NUMPY_NULLABLE, PandasDtypeBackend.PYARROW],
)
@pytest.mark.parametrize(
    "engine",
    ["python", "pyarrow"],
)
async def test_verbs_schema_input(
    fixture_path: str,
    pandas_dtype_backend: PandasDtypeBackend,
    engine: str,
):
    with (Path(fixture_path) / "workflow.json").open() as schema:
        schema_dict = json.load(schema)
        tables: dict[str, pd.DataFrame] = {}
        for input in schema_dict["input"]:
            tables[input] = load_inputs(pandas_dtype_backend, engine)[input]

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
        result_table_path = Path(table_path) / f"result_{expected}"
        expected_table_path = Path(table_path) / expected

        if expected.endswith(".csv"):
            try:
                table_name = expected.split(".")[0]
                table_name_arg = table_name if table_name != "expected" else None
                result = workflow.output(table_name_arg)
                if isinstance(result, pd.DataFrame):
                    result.to_csv(result_table_path, index=False)
                else:
                    result.obj.to_csv(result_table_path, index=False)

                expected_table = read_csv(expected_table_path)
                result_table = read_csv(result_table_path)

                assert_frame_equal(
                    expected_table,
                    result_table,
                    check_like=True,
                    check_dtype=False,
                    check_column_type=False,
                )
            except AssertionError:
                log.info(
                    "Error in %s;\nExpected:\n%s\n\nActual:\n%s",
                    fixture_path,
                    expected_table.head(),
                    result_table.head(),
                )
                raise
            finally:
                result_table_path.unlink()
