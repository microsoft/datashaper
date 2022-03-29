#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np
import pandas as pd

from data_wrangling_components.table_store import DefaultTableStore, TableContainer


def get_test_store():
    tables = [
        TableContainer(
            id="table1",
            table=pd.DataFrame(
                {
                    "ID": [1, 2, 3, 4, 5],
                    "name": ["A", "B", "C", "D", "E"],
                    "count": [10, 20, 30, 40, 50],
                }
            ),
        ),
        TableContainer(
            id="table2",
            table=pd.DataFrame({"ID": [6], "name": ["F"], "count": [60]}),
        ),
        TableContainer(
            id="table3",
            table=pd.DataFrame(
                {
                    "ID": [1, 1, 2, 4, 4, 4],
                    "item": ["bed", "pillow", "sofa", "sofa", "chair", "stool"],
                }
            ),
        ),
        TableContainer(
            id="table4",
            table=pd.DataFrame(
                {
                    "ID": [1, 1, 2, 4, 4, 4],
                    "item": ["bed", "pillow", "sofa", "sofa", "chair", "stool"],
                    "quantity": [45, 78, 100, 89, 50, 45],
                }
            ),
        ),
        TableContainer(
            id="table5",
            table=pd.DataFrame(
                {
                    "ID": [1, 1, 2, 4, 4, 4],
                    "item": ["bed", np.nan, "sofa", "sofa", "chair", np.nan],
                    "quantity": [45, 78, 100, 89, 50, 45],
                }
            ),
        ),
        TableContainer(
            id="table6",
            table=pd.DataFrame(
                {
                    "ID": [1, 2, 3, 4, 5, 6],
                    "FY20": [10000, 56000, 45000, 5000, 8900, 90000],
                    "FY21": [5000, 4000, 45000, 6000, 9000, 78000],
                }
            ),
        ),
        TableContainer(
            id="table7",
            table=pd.DataFrame(
                {
                    "ID": [1, 2, 3, 4, 5],
                    "item": ["bed", "pillow", "sofa", "chair", "stool"],
                    "quantity": [45, 78, 100, 89, 50],
                    "totalSale": [54000, 7800, 230000, 20470, 5000],
                }
            ),
        ),
        TableContainer(
            id="table8",
            table=pd.DataFrame(
                {
                    "ID": [4, 5, 6, 7, 8],
                    "name": ["D", "E", "F", "G", "H"],
                    "count": [80, 90, 100, 110, 120],
                }
            ),
        ),
        TableContainer(
            id="table9",
            table=pd.DataFrame(
                {
                    "count": [
                        10,
                        20,
                        30,
                        40,
                        50,
                        60,
                        70,
                        80,
                        90,
                        100,
                        110,
                        120,
                        130,
                        140,
                        150,
                        160,
                        170,
                        180,
                        190,
                        200,
                    ],
                }
            ),
        ),
        TableContainer(
            id="table10",
            table=pd.DataFrame(
                {
                    "x": ["A", "B", "A"],
                    "y": [1, 2, 1],
                    "z": [4, 5, 4],
                }
            ),
        ),
        TableContainer(
            id="table11",
            table=pd.DataFrame(
                {
                    "x": ["A", "B", "A"],
                    "y": [1, np.nan, 1],
                    "z": [4, 5, 4],
                }
            ),
        ),
        TableContainer(
            id="table12",
            table=pd.DataFrame({"a": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}),
        ),
    ]

    store = DefaultTableStore()

    for table in tables:
        store.set(table.id, table)

    return store
