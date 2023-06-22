import os


def mkdirp(dir: str) -> None:
    """Create a directory if it does not exist."""
    if not os.path.exists(dir):
        os.makedirs(dir)