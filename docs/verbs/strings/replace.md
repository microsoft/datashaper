# replace

Replaces text that matches a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) pattern with new text. By default this is case-sensitive and only finds the first match. Use the `caseInsensitive` and `globalSearch` flags to modify this behavior.

## Example

| name |
| ---- |
| Joe  |
| John |
| Jane |
| Jim  |

`replace column='name' pattern='Jo' with replacement='Su'`:

| name |
| ---- |
| Sue  |
| Suhn |
| Jane |
| Jim  |