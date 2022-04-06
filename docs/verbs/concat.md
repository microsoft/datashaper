# concat

Appends additional tables to the input table, mimicking SQL UNION_ALL. Note that only columns from the input table are retained in the concatenated output.

## Example

input 1

| id  |
| --- |
| 1   |
| 2   |

input 2

| id  | Name |
| --- | ---- |
| 3   | Bob  |
| 4   | Joe  |

`concat tables['input 1', 'input 2']`:

| id  |
| --- |
| 1   |
| 2   |
| 3   |
| 4   |
