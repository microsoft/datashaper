"""Datashaper Function Decorators."""

from .parallel_verb import OperationType, parallel_verb
from .verb import VerbInputSpec, verb

__all__ = ["verb", "VerbInputSpec", "parallel_verb", "OperationType"]
