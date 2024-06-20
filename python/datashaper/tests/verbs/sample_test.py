import pandas as pd

from datashaper.verbs import sample


def test_sample():
    verb_input = pd.DataFrame({"id": [1, 2, 3, 4, 5]})
    output, _ = sample(verb_input, size=2)
    assert len(output) == 2


def test_sample_seed():
    verb_input = pd.DataFrame({"id": [1, 2, 3, 4, 5]})

    values = None
    for i in range(10):
        output, _ = sample(verb_input, size=2, seed=0xBEEF)
        ids = output["id"].tolist()

        if i == 0:
            values = ids
        else:
            assert len(ids) == len(values)
            assert ids[0] == values[0]
            assert ids[1] == values[1]
