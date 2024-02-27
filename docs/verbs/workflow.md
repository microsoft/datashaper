# workflow

Execute a sub-workflow. This verb accepts a `workflow` argument that contains a workflow specification object. As the verb executes, the default input will be used as the default input of the child workflow, and the child workflow's default output will be used as this verb's default output. Deeper input mapping and extraction are not currently supported, but are on our roadmap.

[API docs](https://github.com/microsoft/datashaper/blob/main/javascript/schema/docs/markdown/schema.workflowargs.md)