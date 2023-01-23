# Data Table

The **data table** resource represents the basic input data content. This resource contains a link or embedded direct data, as well as instructions for loading and parsing the content into a table that is accessible to users. In the data table viewer we always show the raw text cells that were imported so you can confirm that everything looks as expected.

Most data table content is interpreted as text by default. This helps us avoid accidentally misinterpreting data and causing data loss. When you import tables you can specify that data types should be discovered automatically, in which case we will analyze the text content and decide the most appropriate data type for each column (checking this box also generates a [codebook](./codebook.md) to accompany your table, which stores the data type information for later use).

Data tables can be stored in a variety of file formats, and we provide options for interpreting those correctly. The two most common are comma-separated (CSV) and JSON. When you import a file you can specify the correct parsing options, but if you get something wrong you can always come back to the data table view and update the parsing options using the side panel. Complete details can be found in the [API documentation](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.datatableschema.md) for data tables, and the most important settings are outlined below.

## CSV

"CSV" stands for "comma-separated values", and is a very [common format](https://en.wikipedia.org/wiki/Comma-separated_values) for sharing data files. You can easily export this format from Excel. Despite the name CSV, you may use a different delimiter than a comma, so we provide options to handle that too. In a CSV file each line of text represents a row in the table and columns are separated by the delimiter.

Most files will load fine using the default settings, but you can tune things to match your format if needed.

- delimiter ("," by default): the character used to separate columns for each row.
- headers in first row (on by default) indicates that the first line of your file has column names. If this is not true, you can provide your own list of column names or we'll assign them "col1", "col2", etc.
- skip rows: ignore this many rows at the start of the file.
- read rows: only read in this many rows (starting at skip rows).
- comment character: if this character is seen on a line, everything after it is considered documentation and is ignored when creating the table.
- line terminator: only use this if your file format has unusual characters to indicate the end of each line.
- quote character: any text contained between two of these characters will not be parsed further. This allows you to include blocks of text that might contain your column delimiter, and we won't create new columns accidentally.
- escape character: this character can be used to escape the delimiter and therefore avoid splitting on specific instances.

## JSON

"JSON" standard for "JavaScript Object Notation", and is frequently used by software applications to share data because it is a [well-defined standard](https://www.json.org/json-en.html). If you have a JSON data file, we can interpret it using a few standard formats for storing table data.

- records: the file contains an array of objects. Each object should have a key and value for each column and row value in the table.
- columnar: the file contains a single object, where each key is a column name, and the attached values are the row values for that column.
- array: the file is a single flat array of values. You can provide the row and column count to interpret the flat array as a matrix.
- values: the file is an array of arrays. Each row is an array of column values. The first row is expected to be column names. This format is the nearest JSON format to a CSV file.

## Editing

When viewing a data table, you can click the "edit" icon at the top right to view the raw input text. This text is editable, and changes will propagate through the system.
