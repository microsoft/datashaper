The core idea with these components is largely analagous to the object-oriented chain-of-responsibility pattern. We construct a workflow, which is a series of table transformation steps (e.g., middleware). We supply a table store to read and write to (e.g., context). After workflow execution is complete, we retrieve one or more output tables from the context.

The fundamental unit of work in the system is a **verb**. Verbs represent primitive operations that return a table. Most verbs require an input table to transform, although this can be optional (for example, the [fetch](./verbs/fetch.md) verb, which executes a remote request to retrieve a table).

All verb implementations should be asynchronous to allow for async fetches, long-running processes, and so on.

Because our verb model is fairly closely aligned with that of [Arquero](https://github.com/uwdata/arquero), the [verb documentation](https://uwdata.github.io/arquero/api/verbs) and [notebook collection](https://observablehq.com/collection/@uwdata/arquero) may be useful references.
