# Codebook

A Codebook defines the schema for [data table](./datatable.md) columns. Each column can define such attributes as the core data type, data nature, and units.

## Schema values

Each column has attributes you can edit that affect how the data is interpreted and displayed. Column schemas can be quite complex, and you can find full details in our [API documentaton](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.field.md). The most important attributes for most uses are shown below.

- Display name: this is a user-friendly name we should show throughout the application, because data column names are often cryptic.
- Description: this provides a place for detailed descriptions of what the column represents.
- Data type: the data type tells processing algorithms how to interpret the data in a column. For example "hello" should be a string, while "1,300" may be treated as a number for computations. If a cell value in the column cannot be interpreted as the stated data type, it will be treated as empty (`null`).
- Data nature: this defines the semantic shape of column data values. For example, if a column consists only of 5-10 unique strings, this is probable "categocial" data, and should be treated differently than "continuous" numeric data.
- Units: this defines the units of the data, for example if the column describes someone's height it may be "inches".
- Mapping: here you can provide a direct remapping of raw data values to new content. This is mostly useful when you have data tables that are full or numeric codes that map to a more human-readable meaning. For example, if your column is "married", you might use "0" for "no", "1" for "yes", "2" for "divorced", etc.

You may also indicate that columns in your table should be ignored entirely using the `excluded` property, which is represented as a checkbox next to the column name in our interface.
