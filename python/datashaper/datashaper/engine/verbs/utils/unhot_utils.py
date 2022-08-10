import copy

from math import nan
from typing import List

from datashaper.engine.verbs.verb_input import VerbInput


def unhotOperation(input: VerbInput, columns: List[str], prefix: str):
    copyInput = copy.deepcopy(input)
    input_table = copyInput.get_input()

    for col in columns:
        index = col.index(prefix)
        value = col[index + len(prefix):len(col)]
        for i in range(len(input_table[col])):
            if(input_table[col][i] == 0):
                input_table[col].loc[i] = nan
            else:
                input_table[col].loc[i] = value

    return copyInput
