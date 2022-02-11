**join** combines two tables using relational inner join mechanics. A join key (column name) from the input and secondary table can be specified. Only rows with a match on each table are copied. All columns from the secondary table are joined with the input. If a secondary join key is not specified, the primary join key is used for both tables.

Example

input 1

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |
| 4   | Kate  |

input 2

| id  | age |
| --- | --- |
| 1   | 32  |
| 2   | 35  |
| 3   | 21  |

`join table['input 1'] with table['input 2'] on column['id']`:

| id  | name  | age |
| --- | ----- | --- |
| 1   | Bob   | 32  |
| 2   | Joe   | 35  |
| 3   | Jenny | 31  |
