# Table Bundle

The **table bundle** brings together all of the component resources to fully materialize a table for analytic use. This can include a base [data table](../datatable/index.md) (e.g., CSV or JSON data file), a [codebook](../codebook/index.md) that defines the schema, and a [workflow](../workflow/index.md) defining transformations to apply.

You can contruct table bundles in a variety of ways, including symlinking from one to another to create derived collections that dynamically update as child dependencies are modified.

## Table view

The main table view shows a fully materialized data table. This view allows you to see statistics about the table and its columns, and to interact with the table to transform it as needed.

The table view is scrollable vertically and horizontally as needed to see all of the data. Each column shows a few basic statistics about the contents, as well as a histogram of the data distribution (when appropriate).

### Transformations

Within the table view, you can directly manipulate individual table columns or the entire table as a whole. To manipulate a column, first select it. Once a column is selected, a set of applicable verbs will be enabled along the top. The most common ones are shown as buttons, with the full suite available in an overflow menu. Choose a verb and fill in the required parameters, then click save to execute it. If you need descriptions of each verb, the popup has a help icon that will display documentation. You can similarly manipulate the entire table with the second set of buttons and overflow menu along the top. This includes verbs such as joining, grouping, and complex column combinators.

As you manipulate the table, the set of verbs will be collected in a history that you can open from the right side. You can select any verb to see the table at that moment. You can also edit or remove verbs from this panel.
