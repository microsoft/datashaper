#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import pandas as pd

from data_wrangling_components.engine.verbs.chain import chain
from data_wrangling_components.table_store import (
    DefaultTableStore,
    LazyTableStorage,
    TableContainer,
)
from data_wrangling_components.types import Step, Verb


def get_store():
    return DefaultTableStore(
        {
            "input": LazyTableStorage(
                TableContainer(id="input", table=pd.DataFrame({"ID": [1, 2, 3, 4]})),
                resolved=True,
            )
        }
    )


def test_single_chain_step():
    step = Step(
        Verb.Chain,
        "input",
        "output",
        args={
            "steps": [
                Step(Verb.Fill, "input", "output", args={"to": "filled", "value": 1})
            ]
        },
    )

    store = get_store()
    result = chain(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 4
    assert store.list() == ["input", "output"]


def test_chain_no_polute_parent_store():
    step = Step(
        Verb.Chain,
        "input",
        "output",
        args={
            "steps": [
                Step(Verb.Fill, "input", "output-1", args={"to": "filled", "value": 1}),
                Step(
                    Verb.Fill,
                    "output-1",
                    "output-2",
                    args={"to": "filled2", "value": 2},
                ),
            ]
        },
    )

    store = get_store()
    result = chain(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 4
    assert all(
        a == b for a, b in zip(result.table.columns, ["ID", "filled", "filled2"])
    )
    assert store.list() == ["input", "output"]


def test_chain_nofork_set_outputs_parent_store():
    step = Step(
        Verb.Chain,
        "input",
        "output",
        args={
            "steps": [
                Step(Verb.Fill, "input", "output-1", args={"to": "filled", "value": 1}),
                Step(
                    Verb.Fill,
                    "output-1",
                    "output-2",
                    args={"to": "filled2", "value": 2},
                ),
            ],
            "nofork": True,
        },
    )

    store = get_store()
    result = chain(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 4
    assert all(
        a == b for a, b in zip(result.table.columns, ["ID", "filled", "filled2"])
    )
    assert store.list() == ["input", "output-1", "output-2", "output"]


def test_chain_recursive_call():
    step = Step(
        Verb.Chain,
        "input",
        "output",
        args={
            "steps": [
                Step(Verb.Fill, "input", "output-1", args={"to": "filled", "value": 1}),
                Step(
                    Verb.Chain,
                    "output-1",
                    "output-2",
                    args={
                        "steps": [
                            Step(
                                Verb.Fill,
                                "output-1",
                                "output-2",
                                args={"to": "filled2", "value": 2},
                            ),
                        ]
                    },
                ),
            ],
        },
    )

    store = get_store()
    result = chain(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 4
    assert all(
        a == b for a, b in zip(result.table.columns, ["ID", "filled", "filled2"])
    )
    assert store.list() == ["input", "output"]
