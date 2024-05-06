import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from logging import getLogger
from pathlib import Path
from threading import Thread

import pandas as pd
import pytest
from pandas.testing import assert_frame_equal

from datashaper import DataTable, load_csv_table

FIXTURES_PATH = "../../schema/fixtures/datatables"

log = getLogger(__name__)

server = HTTPServer(("localhost", 8081), SimpleHTTPRequestHandler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()



def read_csv(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


# pandas won't auto-guess iso dates on import, so we define an explicit iso output for comparison as strings
# this means that the expected.csv _must_ match the expected iso format to seconds granularity
def to_csv(df: pd.DataFrame, path: str) -> None:
    df.to_csv(path, date_format="%Y-%m-%dT%H:%M:%SZ", index=False)


def get_test_specs(root: str) -> list[str]:
    subfolders: list[str] = []
    for data_dir, _, files in os.walk(root):
        if "datatable.json" in files:
            subfolders.append(data_dir)
    return subfolders


@pytest.mark.parametrize("fixture_path", get_test_specs(FIXTURES_PATH))
async def test_verbs_schema_input(
    fixture_path: str
):
    datatable_path = Path(fixture_path) / "datatable.json"
    expected_path = Path(fixture_path) / "expected.json"

    with (datatable_path).open() as schema:
        schema_dict = json.load(schema)
        schema = DataTable.from_dict(schema_dict)
        result_path = Path(fixture_path) / schema_dict["path"]

    try:
                
        expected_table = pd.read_json(expected_path)
        result_table = load_csv_table(result_path, schema)
        assert_frame_equal(
            expected_table,
            result_table,
            check_like=True,
            check_dtype=False,
            check_column_type=False,
        )
    except AssertionError:
        print(  # noqa: T201
            f"Error in {fixture_path}@;\nExpected:\n{expected_table.head()}\n\nActual:\n{result_table.head()}",
        )
        raise
            