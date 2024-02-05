#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import json

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="destructure")
def destructure(
    input: VerbInput,
    column: str,
    keys: List[str] = [],
    prefix: str = "array_",
    preserveSource: bool = False,
):
    input_table = input.get_input()
    output = input_table

    for index in output.index:
        if output[column][index] != None:
            counter = 0
            object = None
            isArray = False

            print(output[column][index])

            try:
                if(json.loads(output[column][index])): #object
                    object = json.loads(output[column][index])
            except: #array
                object = json.loads(json.dumps(output[column][index].split(",")))
                isArray = True

            if isArray:
                print("Array test")
                for i in range(len(object)):
                    print(object[i])
                    output.loc[index, prefix + str(counter)] = object[i]
                    counter = counter + 1
            else:
                print("Object test")
                for property in object:
                    print(property)
                    if (keys == None or len(keys) == 0) or (keys != None and property in keys):
                        output.loc[index, property] = object[property] 
                    
    print(output)
    
    filteredList: list[str] = []

    for col in output.columns:
        if col != column:
            filteredList.append(col)

    if not preserveSource:
        output = output[filteredList]

    print("Final result")
    print(output)

    return TableContainer(table=output)
