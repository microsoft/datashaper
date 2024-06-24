"""Verb engine for processing data."""

import sys

from .create_verb_result import create_verb_result
from .load_verbs import load_verbs
from .types import VerbDetails, VerbResult
from .verb_input import VerbInput

# Load core verbs into VerbManager
mod = sys.modules[__name__]
load_verbs(mod)


__all__ = [
    "VerbInput",
    "create_verb_result",
    "load_verbs",
    "VerbResult",
    "VerbDetails",
]
