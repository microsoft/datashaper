**binarize** converts values to a 0 or 1 based on a comparison function match. This is commonly used in machine learning causal models where the input data needs to be turned into a series of flags. See [filter](./filter.md) for a description of the comparison functions available.

Example

| age |
| --- |
| 12  |
| 32  |
| 35  |
| 64  |

`binarize column['age'] >= 35`:

| age |
| --- |
| 0   |
| 0   |
| 1   |
| 1   |
