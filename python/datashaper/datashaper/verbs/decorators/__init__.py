"""Datashaper Function Decorators."""

from .parallel_verb import ParallelizationOrientation, parallel_verb
from .verb import VerbInputSpec, verb

__all__ = [
    "verb",
    "VerbInputSpec",
    "parallel_verb",
    "ParallelizationOrientation",
]
