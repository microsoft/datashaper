The core idea with these components is largely analagous to the object-oriented chain-of-responsibility pattern. We construct a workflow, which is a series of table transformation steps (e.g., middleware). We supply a table store to read and write to (e.g., context). After workflow execution is complete, we retrieve one or more output tables from the context.

The fundamental unit of work in the system is a **verb**. Verbs represent primitive operations that return a table. Most verbs require an input table to transform.

Because our verb model is fairly closely aligned with that of [Arquero](https://github.com/uwdata/arquero), the [verb documentation](https://uwdata.github.io/arquero/api/verbs) and [notebook collection](https://observablehq.com/collection/@uwdata/arquero) may be useful references.

Within the broader framework, **resources** are used to provide structured schemas and functionality for analytic applications. For example, the verbs are used by the [Workflow resource](./resources/workflow.md) to construct and execute transformation flows with UX.
