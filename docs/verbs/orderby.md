# orderby

Applies a sort operation on the table using a specified column and sort direction. Multiple column + direction instructions can be supplied to produce a compound sort.

## Example

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |

`orderby column['name'], direction='desc'`:

| id  | name  |
| --- | ----- |
| 2   | Joe   |
| 3   | Jenny |
| 1   | Bob   |
