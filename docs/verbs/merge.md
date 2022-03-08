# merge

Collapses multiple columns into one. Invalid values (null, undefined, NaN) are ignored.

Available collapse strategies are:

- first one wins: the first valid column value is used in the output
- last one winss: the last valid column value is used in the output
- concat: all valid column values are concatenated together, and a delimiter can be specified
- array: all valid column values are pushed into a cell array

## Examples

| first | middle | last     |
| ----- | ------ | -------- |
| John  | Ray    | Doe      |
| Bill  |        | Williams |
|       | Colin  | Jeeves   |

`merge columns['first', 'middle', 'last'], strategy='first one wins', to_column='output'`:

| output |
| ------ |
| John   |
| Bill   |
| Colin  |

`merge column['first'] with column['last'], strategy='last one wins', to_column='output'`:

| output   |
| -------- |
| Doe      |
| Williams |
| Jeeves   |

`merge column['first'] with column['last'], strategy='concat', to_column='output'`:

| output        |
| ------------- |
| John Ray Doe  |
| Bill Williams |
| Colin Jeeves  |
