#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import json
import math
from typing import Any

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="destructure")
def destructure(
    input: VerbInput,
    column: str,
    keys: list[str] = [],
    preserveSource: bool = False,
):
    df = input.get_input().copy()

    results = []
    for row_idx, row in df.iterrows():
        try:
            cleaned_row = {col: row[col] for col in df.columns}
            rest_row = row[column] if row[column] is not None else {}

            if is_null(rest_row):
                rest_row = {}

            cleaned_row_string = (
                str(cleaned_row)
                .replace("'", '"')
                .replace('"{"', '{"')
                .replace('"}"}', '"}}')
            )
            rest_row_string = str(rest_row).replace("'", '"')

            cleaned_row_dict = json.loads(cleaned_row_string)
            rest_row_dict = json.loads(rest_row_string)
            filtered_dict = {}

            if keys != []:
                for property in rest_row_dict:
                    if property in keys:
                        filtered_dict[property] = rest_row_dict[property]
            else:
                filtered_dict = rest_row_dict

            results.append({**cleaned_row_dict, **filtered_dict})  # type: ignore
        except Exception as e:
            print(f"Error spreading row: {row}")
            raise e
    df = pd.DataFrame(results, index=df.index)

    if not preserveSource:
        df = df.drop(columns=[column])

    return TableContainer(table=df)


def is_null(value: Any) -> bool:
    """Check if value is null or is nan."""

    def is_none() -> bool:
        return value is None

    def is_nan() -> bool:
        return isinstance(value, float) and math.isnan(value)

    return is_none() or is_nan()
