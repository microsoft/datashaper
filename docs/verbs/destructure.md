# destructure

de-structures a column containing an object into multiple columns, using keys as new columns and their values as the new row values.

Additional options:

- Preserve source column: retains the original column alongside with the new columns.
- Keys: provide a list of which keys from the object the user wants to add as new columns.

Example

| id  | name  |        info         |
| --- | ----- | ------------------- |
| 1   | Bob   | {a: 123, b: 'Test1'}|
| 2   | Joe   | {a: 234, b: 'Test2'}|
| 3   | Jenny | {a: 345, b: 'Test3'}|

`destructure column='info', keys=[a], preserveSource='false'`:

| id  | name  |  a  | 
| --- | ----- | --- |
| 1   | Bob   | 123 |
| 2   | Joe   | 234 |
| 3   | Jenny | 345 |

`destructure column='info', keys=[a], preserveSource='true'`:

| id  | name  |        info         |  a  | 
| --- | ----- | ------------------- | --- |
| 1   | Bob   | {a: 123, b: 'Test1'}| 123 |
| 2   | Joe   | {a: 234, b: 'Test2'}| 234 |
| 3   | Jenny | {a: 345, b: 'Test3'}| 345 |

`destructure column='info', keys=[], preserveSource='false'`:

| id  | name  |  a  |   b   |
| --- | ----- | --- | ----- |
| 1   | Bob   | 123 | Test1 |
| 2   | Joe   | 234 | Test2 |
| 3   | Jenny | 345 | Test3 |

`destructure column='info', keys=[], preserveSource='true'`:

| id  | name  |        info         |  a  |   b   |
| --- | ----- | ------------------- | --- | ----- |
| 1   | Bob   | {a: 123, b: 'Test1'}| 123 | Test1 |
| 2   | Joe   | {a: 234, b: 'Test2'}| 234 | Test2 |
| 3   | Jenny | {a: 345, b: 'Test3'}| 345 | Test3 |


[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.destructureargs.md)