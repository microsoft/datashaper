# Codebook schema

The codebook schema is a JSON document that defines detailed parameters for each column in a table. The JSON editor can be used to customize the schema, including advanced properties that are not available in the web editor.

The high-level blocks available in the codebook schema include:

- general properties, most of which are editable in the UI.
- additional lesser-used properties such as tags, format specifier strings, and inversion.
- a constraints block that allows configuration of per-column validation to ensure data meets format expectations.

Full developer documentation can be [found here](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.field.md), which provides exact details on every JSON field that can be configured.
