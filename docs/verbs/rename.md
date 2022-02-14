**rename** renames columns in a table.

Example

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |

`rename columns['id', 'name'] to=['row', 'first']`:

| row | first |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |
