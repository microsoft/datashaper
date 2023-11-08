# merge

Collapses multiple columns into one. Invalid values (null, undefined, NaN) are ignored.

Available collapse strategies are:

- first one wins: the first valid column value is used in the output
- last one wins: the last valid column value is used in the output
- concat: all valid column values are concatenated together into a string, and a delimiter can be specified
- array: all valid column values are pushed into a cell array

Additional options:

- Keep source columns: retains the original columns instead of replacing.
- Unhot: reverses a onehot encoding before merging by replacing cell values with the column name if 1 or empty if 0.

## Examples

| first | middle | last     |
| ----- | ------ | -------- |
| John  | Ray    | Doe      |
| Bill  |        | Williams |
|       | Colin  | Jeeves   |

`merge columns['first', 'middle', 'last'], strategy='first one wins', to_column='output', keepOriginalColumns='false'`:

| output |
| ------ |
| John   |
| Bill   |
| Colin  |

`merge columns['first', 'last'], strategy='last one wins', to_column='output', keepOriginalColumns='false'`:

| output   |
| -------- |
| Doe      |
| Williams |
| Jeeves   |

`merge columns['first', 'last'], strategy='concat', to_column='output', keepOriginalColumns='false'`:

| output        |
| ------------- |
| John Ray Doe  |
| Bill Williams |
| Colin Jeeves  |

`merge columns['first', 'last'], strategy='concat', to_column='output', keepOriginalColumns='true'`:

| first | middle | last     | output        |
| ----- | ------ | -------- | ------------- |
| John  | Ray    | Doe      | John Ray Doe  |
| Bill  |        | Williams | Bill Williams |
|       | Colin  | Jeeves   | Colin Jeeves  |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.mergeargs.md)