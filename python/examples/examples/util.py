"""Utility functions for examples."""
from pathlib import Path


def mkdirp(dirname: str) -> None:
    """Create a directory if it does not exist."""
    Path(dirname).mkdir(parents=True, exist_ok=True)
