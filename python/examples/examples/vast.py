from typing import List

import pandas as pd

from datashaper import TableContainer, VerbInput, Workflow

dtype = {"date(yyyyMMddHHmmss)": "string"}
vast1 = pd.read_csv("../data/vast/csv-1700-1830.csv", dtype=dtype)
vast2 = pd.read_csv("../data/vast/csv-1831-2000.csv", dtype=dtype)
vast3 = pd.read_csv("../data/vast/csv-2001-2131.csv", dtype=dtype)


def embed(text: str) -> List[float]:
    return [0.1, 0.2, 0.3]


def genid_verb(input: VerbInput, hash: List[str], to: str) -> TableContainer:
    """A custom verb to generate IDs per row."""

    df = input.source.table.copy()

    def hash_row(row) -> str:
        hashtext = "".join([str(row[column]) for column in hash])
        return f"hash({hashtext})"

    df[to] = df.apply(lambda row: hash_row(row), axis=1)
    return TableContainer(table=df)


def embed_verb(input: VerbInput, column: str, to: str) -> TableContainer:
    df = input.source.table.copy()
    df[to] = df.apply(lambda row: embed(row[column]), axis=1)
    return TableContainer(table=df)


workflow = Workflow(
    verbs={
        "genid": genid_verb,
        "embed": embed_verb
    },
    schema={
        "steps": [
            {
                "verb": "concat",
                "input": {"source": "vast1", "others": ["vast2", "vast3"]},
            },
            {
                "verb": "convert",
                "args": {
                    "column": "date(yyyyMMddHHmmss)",
                    "to": "datetime",
                    "type": "date",
                    "formatPattern": "yyyyMMddHHmmss",
                },
            },
            {
                "verb": "select",
                "args": {
                    "columns": [
                        "type",
                        "datetime",
                        "author",
                        "message"
                    ]
                },
            },
            {
                "verb": "genid",
                "args": {
                    "to": "id",
                    "hash": ["datetime", "author", "message"]
                }
            },
            {
                "verb": "embed",
                "args": {
                    "to": "embedding",
                    "column": "message"
                }
            }
        ]
    },
    input_tables={"vast1": vast1, "vast2": vast2, "vast3": vast3},
    validate=False,
    schema_path="../../schema/workflow.json"
)

workflow.run()
result = workflow.output()
print("result: ", result)
