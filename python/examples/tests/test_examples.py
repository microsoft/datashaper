import os
import subprocess
import tempfile

import nbformat
import pytest

NOTEBOOKS_PATH = "notebooks/"

notebooks_list = [file.name for file in os.scandir(NOTEBOOKS_PATH) if file.name.endswith(".ipynb")]

def _notebook_run(filepath):
    """Execute a notebook via nbconvert and collect output.
    :returns (parsed nb object, execution errors)

    Source of this function: http://www.christianmoscardi.com/blog/2016/01/20/jupyter-testing.html
    """
    with tempfile.NamedTemporaryFile(suffix=".ipynb") as temp_file:
        args = [
            "jupyter",
            "nbconvert",
            "--to",
            "notebook",
            "--execute",
            "-y",
            "--no-prompt",
            "--output",
            temp_file.name,
            filepath,
        ]
        subprocess.check_call(args)

        temp_file.seek(0)
        nb = nbformat.read(temp_file, nbformat.current_nbformat)

    errors = [
        output for cell in nb.cells if "outputs" in cell for output in cell["outputs"] if output.output_type == "error"
    ]

    return nb, errors


@pytest.mark.parametrize("notebook_filename", notebooks_list)
def test_notebook(notebook_filename):
    _, errors = _notebook_run(NOTEBOOKS_PATH + notebook_filename)
    assert errors == []