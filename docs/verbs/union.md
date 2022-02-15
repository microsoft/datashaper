**union** is a set operation between an input table and one or more secondary tables that retains the unique set of rows across all tables. This is similar to a [concat](./concat.md) + [dedupe](./dedupe.md).

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

`union table['input 1'] with table['input 2']`:

| id  |
| --- |
| 1   |
| 2   |
| 3   |
| 4   |
