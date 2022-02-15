**spread** unrolls array-valued cells into new columns. Similar to [unroll](./unroll.md), but creating new columns instead of rows. New columns are created using the input column name plus array index. If an output columns list is supplied, any array cells with more values than the supplied output names will be truncated.

Example

| id  | values      |
| --- | ----------- |
| 1   | [10, 15]    |
| 2   | [1, 11, 18] |

`spread column['values']`:

| id  | values      | values_1 | values_2 | values_3 |
| --- | ----------- | -------- | -------- | -------- |
| 1   | [10, 15]    | 10       | 15       | null     |
| 2   | [1, 11, 18] | 1        | 11       | 18       |

`spread column['values'] to_columns=['first', 'second']`:

| id  | values      | first | second |
| --- | ----------- | ----- | ------ |
| 1   | [10, 15]    | 10    | 15     |
| 2   | [1, 11, 18] | 1     | 11     |
