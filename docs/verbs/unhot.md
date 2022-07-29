# unhot

Reverses a onehot encoding by collapsing the encoded columns into a single column and mapping the header values back to cell values. This operation reverses [onehot](./onehot.md).

## Example

| ID    | Name_Microsoft | Name_Bing |
| ----- | ---------------| --------- |
| 1     | 1              | 0         |
| 2     | 0              | 1         |

`unhot columns['Name_Microsoft', 'Name_Bing'], prefix='Name_', to_column='Name', keepOriginalColumns='false'`:

| ID  | Name      |
| --- | --------- |
| 1   | Microsoft |
| 2   | Bing      |