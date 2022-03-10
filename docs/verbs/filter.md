# filter

Creates a filtered table that only contains rows that match specified criteria. Filter can compare the values of an input column to a fixed value (e.g.) `row.value <= 10`), or it can compare to the value of another column in the same row (e.g., `row.value <= row.other_value`). Comparisons can be numeric (=, !=, <, >, etc.) or string-based (equals, contains, starts with, etc.). If an empty/not empty filter is _not_ specified but invalid values are found, the result for that comparison will be a negative match.

## Comparison operators

_numeric_

- Eq ('=')
- NotEq ('!=')
- Lt ('<')
- Lte ('<=')
- Gt ('>')
- Gte ('>=')
- NotEmpty ('is not empty')
- Empty ('is empty')

_string_

- Equal ('equals')
- NotEqual ('is not equal')
- Contains ('contains')
- StartsWith ('starts with')
- EndsWith ('ends with')
- NotEmpty ('is not empty')
- Empty ('is empty')

## Examples

| fy20 | fy21 |
| ---- | ---- |
| 100  | 124  |
| 23   | 165  |
| 354  | 300  |

`filter where column['fy20'] < 200`:

| fy20 | fy21 |
| ---- | ---- |
| 100  | 124  |
| 23   | 165  |

`filter where column['fy20'] > column['fy21']`:

| fy20 | fy21 |
| ---- | ---- |
| 354  | 300  |
