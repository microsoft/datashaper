#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from copy import deepcopy
from typing import List

from dataclasses import dataclass

from data_wrangling_components.engine.verbs.verbs_mapping import functions
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step, Verb, compound_verbs


@dataclass
class ChainArgs:
    steps: List[Step]
    nofork: bool = False


def chain(step: Step, store: TableStore):
    """Runs a series of steps in a pipeline

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.chain.ChainArgs`
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution
    :type store: TableStore

    :return: the final output of executing the pipeline
    """
    args = ChainArgs(
        steps=step.args["steps"],
        nofork=step.args.get("nofork", False),
    )

    if args.nofork:
        steps_store = store
    else:
        steps_store = deepcopy(store)

    for chain_step in args.steps:
        chain_step = (
            Step(
                verb=Verb(chain_step["verb"]),
                input=chain_step["input"],
                output=chain_step["output"],
                args=chain_step["args"],
            )
            if isinstance(chain_step, dict)
            else chain_step
        )
        try:
            if chain_step.verb in compound_verbs:
                output = chain(chain_step, steps_store)
            else:
                output = functions[chain_step.verb](chain_step, steps_store)
            steps_store.set(chain_step.output, output)
        except Exception as e:
            logging.error("Pipeline failed on step '{}'", chain_step)
            raise e

    output = steps_store.table(steps_store.list()[-1])
    output_container: TableContainer = TableContainer(
        id=step.output, name=step.output, table=output
    )
    store.set(step.output, output_container)
    return output_container
