#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np
import pandas as pd

from data_wrangling_components.table_store import Table, TableStore


def get_test_store():
    store = TableStore(
        {
            "table1": Table(
                "table1",
                pd.DataFrame(
                    {
                        "ID": [1, 2, 3, 4, 5],
                        "name": ["A", "B", "C", "D", "E"],
                        "count": [10, 20, 30, 40, 50],
                    }
                ),
            ),
            "table2": Table(
                "table2", pd.DataFrame({"ID": [6], "name": ["F"], "count": [60]})
            ),
            "table3": Table(
                "table3",
                pd.DataFrame(
                    {
                        "ID": [1, 1, 2, 4, 4, 4],
                        "item": ["bed", "pillow", "sofa", "sofa", "chair", "stool"],
                    }
                ),
            ),
            "table4": Table(
                "table4",
                pd.DataFrame(
                    {
                        "ID": [1, 1, 2, 4, 4, 4],
                        "item": ["bed", "pillow", "sofa", "sofa", "chair", "stool"],
                        "quantity": [45, 78, 100, 89, 50, 45],
                    }
                ),
            ),
            "table5": Table(
                "table5",
                pd.DataFrame(
                    {
                        "ID": [1, 1, 2, 4, 4, 4],
                        "item": ["bed", np.nan, "sofa", "sofa", "chair", np.nan],
                        "quantity": [45, 78, 100, 89, 50, 45],
                    }
                ),
            ),
            "table6": Table(
                "table6",
                pd.DataFrame(
                    {
                        "ID": [1, 2, 3, 4, 5, 6],
                        "FY20": [10000, 56000, 45000, 5000, 8900, 90000],
                        "FY21": [5000, 4000, 45000, 6000, 9000, 78000],
                    }
                ),
            ),
            "table7": Table(
                "table7",
                pd.DataFrame(
                    {
                        "ID": [1, 2, 3, 4, 5],
                        "item": ["bed", "pillow", "sofa", "chair", "stool"],
                        "quantity": [45, 78, 100, 89, 50],
                        "totalSale": [54000, 7800, 230000, 20470, 5000],
                    }
                ),
            ),
            "table8": Table(
                "table8",
                pd.DataFrame(
                    {
                        "ID": [4, 5, 6, 7, 8],
                        "name": ["D", "E", "F", "G", "H"],
                        "count": [80, 90, 100, 110, 120],
                    }
                ),
            ),
            "table9": Table(
                "table9",
                pd.DataFrame(
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
            "table10": Table(
                "table10",
                pd.DataFrame(
                    {
                        "x": ["A", "B", "A"],
                        "y": [1, 2, 1],
                        "z": [4, 5, 4],
                    }
                ),
            ),
            "table11": Table(
                "table11",
                pd.DataFrame(
                    {
                        "x": ["A", "B", "A"],
                        "y": [1, np.nan, 1],
                        "z": [4, 5, 4],
                    }
                ),
            ),
            "table12": Table(
                "table12", pd.DataFrame({"a": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]})
            ),
        }
    )

    return store
