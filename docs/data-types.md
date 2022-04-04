# Data types 
Data types present a number of thorny edge cases when dealing with different language standards and text file representations. This document lays out a consistent approach to data types, coercion, and error handling that is informed by pandas, Arquero, and the JavaScript and Python language behaviors. In general, we try to respect language defaults unless there are clear issues that the data wrangling context presents. We also try to establish reasonable defaults that can be observed across implementations with minimal configuration or UX, since we are building tools for non-data-scientists.

## Common tricky use cases:
- Text-based data files may contain strings that represent primitive values. Parsing these files should respect the data file's intent even if it overrides default language behavior. The most common example of this is probably boolean data columns with the values "true" and "false". JavaScript will naturally parse any non-empty string as `true`, so "false" -> `true`. A similar situation has been observed with "null".
- Dates can be represented in a wide variey of formats, and parsing/guessing implementations differ by platform and library.
  - `new Date()` in JavaScript is problematic, and may also conflict with pandas' [date guessing](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html?highlight=date#date-handling).
- Autotomatic type discovery for columns is performed by both Arquero and pandas, but may have different results.
- Some verbs can only be performed on certain data types, and other verbs can work with different data types but have different operators available. For example:
  - [bin](./verbs/bin.md) requires numeric input types.
  - [filter](./verbs/filter.md) requires different comparison operators depending on type (e.g., string 'contains' versus numeric 'less than').
- Python does not have `undefined`, but it is commonly used as a return value in JavaScript for optional properties, potentially causing cross-platform/serialization confusion.

## Rules
The following rules will be observed across implementations to ensure consistent treatment of data values:
- `null` (JavaScript) or `None` (Python) will be used for empty cell values. `undefined` will be avoided in JavaScript for data table values.
- `null` or `None` will not be coerced to other types, either during auto-typing or with the [convert](./verbs/convert.md) verb.
- We use nullable values to account for missing data. E.g., `null` is a valid cell value in an integer or boolean column to represent missing data (as opposed to casting to `NaN` or `false`).
- Coercing unparseable strings to dates will result in an `Invalid Date` (JavaScript) or `NaT` (pandas.to_datetime with errors='coerce').
- Coercing unparseable strings to numbers will result in `NaN` (pandas.to_numeric with errors='coerce').
- When reading text files, the pandas default strings for [missing values](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#na-values) and [booleans](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#boolean-values) will be used.
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) will be used for standard date formatting. Other date formats will not be auto-guessed.
  - When providing a custom parse or format pattern, we follow python and use the [1989 C standard tokens](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior). [d3-time-format](https://github.com/d3/d3-time-format) supports this standard for JavaScript.
- We provide users with the option to turn auto-typing off to ensure we do not lose data inappropriately.
