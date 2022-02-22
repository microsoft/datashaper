#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.derive import derive
from data_wrangling_components.types import MathOperator, Step, Verb


def test_derive_concat_string_number():
    step = Step(
        Verb.Derive,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column1": "name",
            "operator": MathOperator.Concatenate,
            "column2": "count",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
    assert result.loc[0, "newColumn"] == "A10"
    assert result.loc[1, "newColumn"] == "B20"
    assert result.loc[2, "newColumn"] == "C30"
    assert result.loc[3, "newColumn"] == "D40"
    assert result.loc[4, "newColumn"] == "E50"


def test_derive_substract_string_number():
    step = Step(
        Verb.Derive,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column1": "name",
            "operator": MathOperator.Subtract,
            "column2": "count",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
    assert np.isnan(result["newColumn"]).all()


def test_derive_multiply_string_number():
    step = Step(
        Verb.Derive,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column1": "name",
            "operator": MathOperator.Multiply,
            "column2": "count",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
    assert np.isnan(result["newColumn"]).all()


def test_derive_divide_string_number():
    step = Step(
        Verb.Derive,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column1": "name",
            "operator": MathOperator.Divide,
            "column2": "count",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
    assert np.isnan(result["newColumn"]).all()


def test_derive_add_number_number():
    step = Step(
        Verb.Derive,
        "table6",
        "output",
        args={
            "to": "newColumn",
            "column1": "FY20",
            "operator": MathOperator.Add,
            "column2": "FY21",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 6
    assert result.loc[0, "newColumn"] == 15000
    assert result.loc[1, "newColumn"] == 60000
    assert result.loc[2, "newColumn"] == 90000
    assert result.loc[3, "newColumn"] == 11000
    assert result.loc[4, "newColumn"] == 17900
    assert result.loc[5, "newColumn"] == 168000


def test_derive_subtract_number_number():
    step = Step(
        Verb.Derive,
        "table6",
        "output",
        args={
            "to": "newColumn",
            "column1": "FY20",
            "operator": MathOperator.Subtract,
            "column2": "FY21",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 6
    assert result.loc[0, "newColumn"] == 5000
    assert result.loc[1, "newColumn"] == 52000
    assert result.loc[2, "newColumn"] == 0
    assert result.loc[3, "newColumn"] == -1000
    assert result.loc[4, "newColumn"] == -100
    assert result.loc[5, "newColumn"] == 12000


def test_derive_multiply_number_number():
    step = Step(
        Verb.Derive,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column1": "ID",
            "operator": MathOperator.Multiply,
            "column2": "count",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
    assert result.loc[0, "newColumn"] == 10
    assert result.loc[1, "newColumn"] == 40
    assert result.loc[2, "newColumn"] == 90
    assert result.loc[3, "newColumn"] == 160
    assert result.loc[4, "newColumn"] == 250


def test_derive_divide_number_number():
    step = Step(
        Verb.Derive,
        "table7",
        "output",
        args={
            "to": "newColumn",
            "column1": "totalSale",
            "operator": MathOperator.Divide,
            "column2": "quantity",
        },
    )

    store = get_test_store()

    result = derive(step, store)

    assert len(result.columns) == 5
    assert len(result) == 5
    assert result.loc[0, "newColumn"] == 1200
    assert result.loc[1, "newColumn"] == 100
    assert result.loc[2, "newColumn"] == 2300
    assert result.loc[3, "newColumn"] == 230
    assert result.loc[4, "newColumn"] == 100
