"""Sample workflow for VAST MC3 data."""

import json
import os

import pandas as pd
import requests

from datashaper import Workflow

from .util import mkdirp
from .verbs import embed


def load_dataframe_from_json_url(url: str, array_property: str) -> pd.DataFrame:
    response = requests.get(url)
    response.encoding = "utf-8-sig"
    json_data = json.loads(response.text)
    json_records = json_data[array_property]
    column_types = {"location": str, "key_vals.Locale": str, "type": str}
    df = pd.json_normalize(
        json_records,
        sep=".",
        record_path=None,
        meta=None,
        meta_prefix=None,
        record_prefix=None,
        errors="raise",
        max_level=None,
    )
    df = df.astype(column_types)
    return df


majestic_data_url = (
    "https://raw.githubusercontent.com/richgel999/ufo_data/main/bin/majestic.json"
)
majestic_data_property = "Majestic Timeline"
majestic = load_dataframe_from_json_url(majestic_data_url, majestic_data_property)

workflow = Workflow(
    verbs={"embed": embed},
    schema={
        "steps": [
            {
                "input": "majestic",
                "verb": "select",
                "args": {
                    "columns": [
                        "source_id",
                        "desc",
                        "date",
                        "type",
                        "location",
                        "source",
                        "key_vals.LatLong",
                        "key_vals.Credibility",
                        "key_vals.Country",
                        "key_vals.Duration",
                        "key_vals.Strangeness",
                        "key_vals.Locale",
                        "key_vals.LocationLink",
                        "key_vals.State/Prov",
                    ]
                },
            },
            {
                "verb": "rename",
                "args": {
                    "columns": {
                        "source_id": "id",
                        "key_vals.LatLong": "lat_long",
                        "key_vals.Credibility": "credibility",
                        "key_vals.Country": "country",
                        "key_vals.Duration": "duration",
                        "key_vals.Strangeness": "strangeness",
                        "key_vals.Locale": "locale",
                        "key_vals.LocationLink": "location_link",
                        "key_vals.State/Prov": "state_prov",
                    }
                },
            },
            {"verb": "embed", "args": {"column": "desc", "to": "desc_embedded"}},
        ]
    },
    input_tables={"majestic": majestic},
    schema_path="../../schema/workflow.json",
)

workflow.run()
result = workflow.output()
print("result: ", result)

mkdirp('out')
result.to_parquet("out/majestic.parquet")
