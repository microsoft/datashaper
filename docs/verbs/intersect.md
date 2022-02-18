# intersect

Set operation between an input table and one or more secondary tables, retaining only those rows that occur in all tables.

## Example

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

`intersect table['input 1'] with table['input 2']`:

| id  |
| --- |
| 1   |
