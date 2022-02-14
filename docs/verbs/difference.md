**difference** is a set operation between an input table and one or more secondary tables, retaining only those rows from the input table that do not occur in any of the secondary tables.

Example

input 1

| id  |
| --- |
| 1   |
| 2   |

input 2

| id  |
| --- |
| 1   |
| 3   |
| 4   |

`difference table['input 1'] with table['input 2']`:

| id  |
| --- |
| 2   |
