"""Sample workflow for VAST MC3 data."""

import pandas as pd

from datashaper import Workflow

from .verbs import embed_mock as embed, genid


gh_url = "https://raw.githubusercontent.com/darthtrevino/vast-mc3-data/main"
dtype = {"date(yyyyMMddHHmmss)": "string"}
vast1 = pd.read_csv(f"{gh_url}/csv-1700-1830.csv", dtype=dtype)
vast2 = pd.read_csv(f"{gh_url}/csv-1831-2000.csv", dtype=dtype)
vast3 = pd.read_csv(f"{gh_url}/csv-2001-2131.csv", dtype=dtype)

workflow = Workflow(
    verbs={"genid": genid, "embed": embed},
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
                "args": {"columns": ["type", "datetime", "author", "message"]},
            },
            {
                "verb": "genid",
                "args": {"to": "id", "hash": ["datetime", "author", "message"]},
            },
            {"verb": "embed", "args": {"to": "embedding", "column": "message"}},
        ]
    },
    input_tables={"vast1": vast1, "vast2": vast2, "vast3": vast3},
    validate=False,
    schema_path="../../schema/workflow.json",
)

workflow.run()
result = workflow.output()
print("result: ", result)
