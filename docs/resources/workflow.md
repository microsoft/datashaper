# Workflow

A **workflow** is a collection of transformation verbs that takes one or more input tables (one base table, and additional optional join or lookup tables), applies the verbs in series, and returns a final output.

Verbs are low-level transformation primitives that capture a specific table operation. For example, selecting a subset of the table columns would be a verb, or joining two tables to create a new table. The [table bundle](./tablebundle.md) editor provides an interface for manipulating tables directly, and contains embedded documentation on every verb available.
