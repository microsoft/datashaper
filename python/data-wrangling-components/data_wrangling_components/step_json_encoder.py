#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from enum import Enum
from json import JSONEncoder
from typing import Any

from data_wrangling_components.types import Step


class StepJsonEncoder(JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, Step):
            return self.encode_step(o)
        if isinstance(o, Enum):
            return o.value
        return super().default(o)

    def encode_step(self, o: Step) -> Any:
        return {
            "verb": o.verb.value,
            "input": o.input,
            "output": o.output,
            "args": o.args,
        }
