# onehot

Takes an input column and creates new binary categorical columns for every unique value. One hot encoding is commonly used in machine learning algorithms that require individual binary features. This operation is akin to a reverse [merge](./merge.md) paired with a [binarize](./binarize.md).

An optional prefix can be supplied for the output columns to help differentiate categorical outputs on large tables. New output columns are lexically sorted.

## Example

| item  |
| ----- |
| lamp  |
| chair |
| lamp  |
| sofa  |
| sofa  |
| lamp  |

`onehot column['item']`:

| item  | chair | lamp | sofa |
| ----- | ----- | ---- | ---- |
| lamp  | 0     | 1    | 0    |
| chair | 1     | 0    | 0    |
| lamp  | 0     | 1    | 0    |
| sofa  | 0     | 0    | 1    |
| sofa  | 0     | 0    | 1    |
| lamp  | 0     | 1    | 0    |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.onehotargs.md)