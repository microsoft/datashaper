# drop

delete the selected columns from the table.

Example

| id  | name  | age |
| --- | ----- | --- |
| 1   | Bob   | 32  |
| 2   | Joe   | 35  |
| 3   | Jenny | 31  |

`drop columns['name', 'age']`:

| id  |
| --- |
| 1   |
| 2   |
| 3   |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.dropargs.md)