# binarize

Converts values to a 0 or 1 based on a comparison function match. This is commonly used in machine learning models where the input data needs to be turned into a series of flags. See [filter](./filter.md) for a description of the comparison functions available.  Multiple criteria can be applied against the input column, which will be treated as a series of [boolean](./boolean.md) queries.

Note: if you need to split categorical data into binarized columns, use [onehot](./onehot.md)

## Examples

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

`binarize column['age'] >= 35 OR < 15 `:

| age |
| --- |
| 1   |
| 0   |
| 1   |
| 1   |
