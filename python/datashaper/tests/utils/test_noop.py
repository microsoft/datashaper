from datashaper.execution.utils import noop


def test_noop():
    result = noop()
    assert result is None
