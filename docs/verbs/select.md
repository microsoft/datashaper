**select** selects only the specified list of columns into a new table.

Example

| id  | name  | age |
| --- | ----- | --- |
| 1   | Bob   | 32  |
| 2   | Joe   | 35  |
| 3   | Jenny | 31  |

`select columns['id', 'age']`:

| id  | age |
| --- | --- |
| 1   | 32  |
| 2   | 35  |
| 3   | 31  |
