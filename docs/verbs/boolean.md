# boolean

Combines columns using [boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra). Column values of any kind can be combined; they will be coerced to boolean values for evaluation:

- Native booleans (`true`/`false`) will left as is
- Any non-empty string will be treated as `true` except the string 'false'
- Any numeric value other than 0 will be `true`
- Any valid Date will be `true`
- All invalid or empty values (null, undefined, NaN) will be treated as `false`

The column output will be a 1 (true) or 0 (false).

For boolean _comparison_ operators, use the [binarize](./binarize.md) verb.

## Operators

- OR: any `true` value returns true
- AND: all values must be `true`
- XOR (exclusive OR): only one value may be `true`
- NOR (not OR): no values can be `true`
- NAND (not AND): any values can be `true` not not _all_ can

Note that in formal boolean algebra some operators expect exactly two input values. For data wrangling convenience we allow any number of input values and have worded the definitions above accordingly.

## Examples

| A | B |
| - | - |
| 1 | 1 |
| 0 | 1 |
| 1 | 0 |
| 0 | 0 |

`boolean columns['A', 'B'], operator='OR' to_column='output'`:

| output |
| ------ |
| 1      |
| 1      |
| 1      |
| 0      |

`boolean columns['A', 'B'], operator='AND' to_column='output'`:

| output |
| ------ |
| 1      |
| 0      |
| 0      |
| 0      |
