"""Datashaper Function Decorators."""

from .parallel_verb import OperationType, parallel_verb
from .verb import verb

__all__ = ["verb", "parallel_verb", "OperationType"]
