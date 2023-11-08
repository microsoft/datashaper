# window

Performs window operations on table columns. Normally the table should be [grouped](./groupby.md) first, otherwise the window function will be performed using all rows. Note also that because window functions operate on a sliding row window, it is important that your table is [ordered](./orderby.md) the way you want it before applying the window.

## Operations

- `row_number`: Assigns an incrementing number to each row
- `rank`: Assigns an incremental rank to each row in order - rows with identical values will receive the same rank
- `percent_rank`: Assigns a `rank` but uses a percentage of values in the group, where the first row is 0 and the last is 1
- `cume_dist`: Similar to `percent_rank` assigns a distribution from 0-1 across the rows
- `first_value`: Plucks the first value in the group and uses it as the output for the entire group
- `last_value`: Plucks the last value in the group and uses it as the output for the entire group
- `fill_down`: Fills blank spaces down the column using last valid value from rows before the empty cell
- `fill_up`: Fills blank spaces _up_ the column using last valid value from rows after the empty cell

## Examples

| id  | value |
| --- | ----- |
| 1   | 10    |
| 1   | 15    |
| 2   | 1     |
| 2   | 11    |
| 2   | 18    |

`window column['value'] with function='row_number', to_column='output'`:

| id  | value | output |
| --- | ----- | ------ |
| 1   | 10    | 1      |
| 1   | 15    | 2      |
| 2   | 1     | 3      |
| 2   | 11    | 4      |
| 2   | 18    | 5      |

`groupby column['id']` and then `window column['value'] with function='row_number', to_column='output'`:

| id  | value | output |
| --- | ----- | ------ |
| 1   | 10    | 1      |
| 1   | 15    | 2      |
| 2   | 1     | 1      |
| 2   | 11    | 2      |
| 2   | 18    | 3      |

`groupby column['id']` and then `window column['value'] with function='first_value', to_column='output'`:

| id  | value | output |
| --- | ----- | ------ |
| 1   | 10    | 10     |
| 1   | 15    | 10     |
| 2   | 1     | 1      |
| 2   | 11    | 1      |
| 2   | 18    | 1      |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.windowargs.md)