# unhot

Reverses a onehot encoding by collapsing the encoded columns into a single column and mapping the header values back to cell values. This operation reverses [onehot](./onehot.md).

Additional options:

- Keep source columns: leave the sources instead of replacing with the new collapsed column.
- Prefix: Strip this prefix from the column headers to derive the value. Useful if a prefix was added during original `onehot`.

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

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.unhotargs.md)