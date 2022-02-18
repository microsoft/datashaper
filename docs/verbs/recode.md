# recode

Allows mapping of cell contents from one one value to another. This is useful for categorizing or otherwise performing direct value transforms.

## Example

| product       |
| ------------- |
| xbox 360      |
| xbox one      |
| xbox series x |
| outlook       |
| word          |
| excel         |
| powerpoint    |

`recode column['product] values=['xbox 360' -> 'xbox', 'xbox one' -> 'xbox', 'xbox series x' -> 'xbox', 'outlook -> m365', 'word' -> 'm365', 'excel' -> 'm365', 'powerpoint' -> 'm365'], to_column='family'`

| product       | family |
| ------------- | ------ |
| xbox 360      | xbox   |
| xbox one      | xbox   |
| xbox series x | xbox   |
| outlook       | m365   |
| word          | m365   |
| excel         | m365   |
| powerpoint    | m365   |
