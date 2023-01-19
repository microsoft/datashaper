# lookup

Similar to [join](./join.md). The primary difference is that all rows in the input table are preserved, and only values from specified columns in the secondary table are copied. If more than one row in the secondary table matches, the **last** value found will be copied.

## Example

input 1

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |

input 2

| id  | login_date |
| --- | ---------- |
| 1   | 2022-01-01 |
| 2   | 2022-01-01 |
| 3   | 2022-01-01 |
| 1   | 2022-01-03 |
| 2   | 2022-01-05 |
| 1   | 2022-01-08 |

`lookup table['input 1'] with table['input 2'] on column['id'], copy columns['login_date']`:

| id  | name  | login_date |
| --- | ----- | ---------- |
| 1   | Bob   | 2022-01-08 |
| 2   | Joe   | 2022-01-05 |
| 3   | Jenny | 2022-01-01 |
