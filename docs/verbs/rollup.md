# rollup

Performs aggregation operations on table columns. Normally the table should be [grouped](./groupby.md) first, otherwise the aggregation will be performed using all rows. Aggregation is commonly used to compute statistics over a list of values. To avoid interface complexity, this verb currently only supports aggregations that take a single column as the input.

## Operations

- `any`: plucks a single value
- `count`: counts the values
- `distinct`: counts the unique values
- `valid`: counts the number of valid (non-null) values
- `invalid`: counts the number of invalid values (null, undefined, NaN)
- `max`: finds the maximum value
- `min`: finds the minimum value
- `sum`: sums the values
- `product`: computes the product of the values
- `mean`: computes the mean of the values
- `mode`: finds the mode of the values
- `median`: finds the median of the values
- `stdev`: computes the standard deviation of the values
- `stdevp`: computes the population standard deviation of the values
- `variance`: computes the variane of the values
- `array_agg`: collects all of the values in an array
- `array_agg_distinct`: collects all of the unique values in an array

## Examples

| id  | value |
| --- | ----- |
| 1   | 10    |
| 1   | 15    |
| 2   | 1     |
| 2   | 11    |
| 2   | 18    |

`rollup column['value'] with function='sum', to_column='output'`:

| output |
| ------ |
| 55     |

`groupby column['id']` and then `rollup column['value'] with function='sum', to_column='output'`:

| id  | output |
| --- | ------ |
| 1   | 25     |
| 2   | 30     |

`groupby column['id']` and then `rollup column['value'] with function='array_agg', to_column='output'`:

| id  | output      |
| --- | ----------- |
| 1   | [10, 15]    |
| 2   | [1, 11, 18] |
