import json
import os
from functools import cache
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread

import pandas as pd
import pytest
from pandas.testing import assert_frame_equal

from datashaper import PandasDtypeBackend, Workflow

FIXTURES_PATH = "fixtures/workflow"
TABLE_STORE_PATH = "fixtures/workflow_inputs"
SCHEMA_PATH = "workflow.json"

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
    for expected in os.listdir(fixture_path):
        if expected.endswith(".csv"):
            try:
                table_name = expected.split(".")[0]
                table_name_arg = table_name if table_name != "expected" else None
                result = workflow.output(table_name_arg)
                if isinstance(result, pd.DataFrame):
                    result.to_csv(
                        Path(fixture_path) / f"result_{expected}", index=False
                    )
                else:
                    result.obj.to_csv(
                        Path(fixture_path) / f"result_{expected}", index=False
                    )
                assert_frame_equal(
                    read_csv(Path(fixture_path) / expected),
                    read_csv(Path(fixture_path) / f"result_{expected}"),
                    check_like=True,
                    check_dtype=False,
                    check_column_type=False,
                )
            finally:
                (Path(fixture_path) / f"result_{expected}").unlink()
