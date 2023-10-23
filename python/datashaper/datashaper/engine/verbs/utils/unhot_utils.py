import copy
from math import nan
from typing import List

from ..verb_input import VerbInput


def unhot_operation(input: VerbInput, columns: List[str], prefix: str):
    """
    Unwind one-hot encoding.
    """
    copyInput = copy.deepcopy(input)
    input_table = copyInput.get_input()

    for col in columns:
        index = col.index(prefix)

        start = index + len(prefix)
        end = len(col)
        value = col[start:end]
        for i in range(len(input_table[col])):
            if input_table[col][i] == 0:
                input_table[col].loc[i] = nan
            else:
                input_table[col].loc[i] = value

    return copyInput
