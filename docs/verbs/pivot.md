# pivot

Performs an inverse of the [fold](./fold.md) operation, aggregating output values. If you want a direct fold reversal that restores rows, use [unfold](./unfold.md). If an aggregation operation is not specified, `any` is used.

## Example

| key   | value |
| ----- | ----- |
| id    | 1     |
| sales | 100   |
| id    | 1     |
| sales | 200   |
| id    | 2     |
| sales | 150   |
| sales | 300   |
| id    | 3     |
| sales | 12    |
| sales | 31    |

`pivot key['id'], value['sales'], operation='sum'`:

| id  | sales |
| --- | ----- |
| 1   | 300   |
| 2   | 450   |
| 3   | 43    |
