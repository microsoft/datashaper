# Data table schema

The data table schema is a JSON document that defines detailed parameters for reading and interpreting a table. The JSON editor can be used to customize the schema, including advanced properties that are not available in the web editor.

The high-level blocks available in the data table schema include:

- embedded data directly in the JSON file instead of linked.
- parser options for reading the text content into a table format.
- descriptors for the shape of the data, which tells our interpreters more about how to understand the content.
- typing hints that indicate how to convert string values into strict types such as numbers.

Full developer documentation can be [found here](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.datatableschema.md), which provides exact details on every JSON field that can be configured.
