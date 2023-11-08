# derive

Performs math operations across two columns to create a new combined column.

## Example

| fy20 | fy21 |
| ---- | ---- |
| 100  | 124  |
| 23   | 165  |
| 354  | 300  |

`derive column['fy20'] operation='add' with column['fy21'], to_column='output'`:

| output |
| ------ |
| 224    |
| 188    |
| 354    |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.deriveargs.md)