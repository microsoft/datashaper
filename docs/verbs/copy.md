# copy

copy the content of the column into a new column.

Example

| id  | name  | age |
| --- | ----- | --- |
| 1   | Bob   | 32  |
| 2   | Joe   | 35  |
| 3   | Jenny | 31  |

`copy column='age', to='newColumn'`:

| id  | name  | age | newColumn |
| --- | ----- | --- | --------- |
| 1   | Bob   | 32  | 32        |
| 2   | Joe   | 35  | 35        |
| 3   | Jenny | 31  | 31        |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.copyargs.md)