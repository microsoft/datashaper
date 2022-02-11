**fold** takes a list of input columns and folds them into a new pair of `[key, value]` columns. The output name of the `key` and `value` columns can be customized.

Example

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |

`fold columns['id', 'name']`:

| key  | value |
| ---- | ----- |
| id   | 1     |
| name | Bob   |
| id   | 2     |
| name | Joe   |
| id   | 3     |
| name | Jenny |
