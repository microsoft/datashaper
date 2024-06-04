from pathlib import Path

import pandas as pd

from datashaper.verbs import snapshot


def make_verb_input(data: list, columns: list[str]):
    return pd.DataFrame(data=data, columns=columns)


def test_snapshot_csv():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot(verb_input, name="test-file", file_type="csv")
    p = Path("test-file.csv")
    assert p.exists()
    p.unlink()


def test_snapshot_json():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot(verb_input, name="test-file", file_type="json")
    p = Path("test-file.json")
    assert p.exists()
    p.unlink()


def test_snapshot_parquet():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot(verb_input, name="test-file", file_type="parquet")
    p = Path("test-file.parquet")
    assert p.exists()
    p.unlink()
