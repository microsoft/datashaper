# boolean

Combines columns using [boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra). Column values of any kind can be combined; they will be coerced to boolean values for evaluation:

- [Wolfram Alpha](https://www.wolframalpha.com/) was used as our source of logical definitions. 
- Native booleans (`true`/`false`) will left as is
- Any non-empty string will be treated as `true` except the string 'false'
- Any numeric value other than 0 will be `true`
- Any valid Date will be `true`
- All invalid or empty values (null, undefined, NaN) will be considered null values

The column output will be a 1 (true) or 0 (false).

For boolean _comparison_ operators, use the [binarize](./binarize.md) verb.

## Operators

- OR: any `true` value returns true
- AND: all values must be `true`
- NOR (not OR): no values can be `true`
- NAND (not AND): any values can be `true` but not _all_ can
- XOR (exclusive OR): every pairwise comparison must contain one `true` and one `false` value
- XNOR (not exclusive OR): Every pairwise comparison must be two `true` or two `false` to be `true`

Note that in formal boolean algebra some operators expect exactly two input values. For data wrangling convenience we allow any number of input values and have worded the definitions above accordingly. Because real-world data also often has missing data that represent unknown values, our boolean logic mimics the [pandas approach](https://pandas.pydata.org/pandas-docs/stable/user_guide/boolean.html) and uses [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic).

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

`boolean columns['A', 'B'], operator='NAND' to_column='output'`:

| output |
| ------ |
| 0      |
| 1      |
| 1      |
| 1      |

`boolean columns['A', 'B'], operator='NOR' to_column='output'`:

| output |
| ------ |
| 0      |
| 0      |
| 0      |
| 1      |

`boolean columns['A', 'B'], operator='XOR' to_column='output'`:

| output |
| ------ |
| 0      |
| 1      |
| 1      |
| 0      |

`boolean columns['A', 'B'], operator='XNOR' to_column='output'`:

| output |
| ------ |
| 1      |
| 0      |
| 0      |
| 1      |

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.booleanargs.md)