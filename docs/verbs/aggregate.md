# aggregate

Combines a [groupby](./groupby.md) with a [rollup](./rollup.md) to support all-in-one data aggregations.

## Example

| id  | value |
| --- | ----- |
| 1   | 10    |
| 1   | 15    |
| 2   | 1     |
| 2   | 11    |
| 2   | 18    |

`aggregate column['value'] with function='sum', groupby column['id'], to_column='output'`:

| id  | output |
| --- | ------ |
| 1   | 25     |
| 2   | 30     |
