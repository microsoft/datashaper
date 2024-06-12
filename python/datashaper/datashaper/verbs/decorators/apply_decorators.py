"""A utility function for applying a series of decorators to a function reference."""

from collections.abc import Callable
from functools import reduce


def apply_decorators(decorators: list[Callable], verb: Callable) -> None:
    """
    Apply a series of decorators to a function reference.

    This is useful for splitting apart verb registration from the verb implementation.
    """
    reduce(lambda x, y: y(x), reversed(decorators), verb)
