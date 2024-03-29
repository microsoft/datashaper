<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/schema](./schema.md) &gt; [ResourceSchema](./schema.resourceschema.md) &gt; [sources](./schema.resourceschema.sources.md)

## ResourceSchema.sources property

List of resources that underlie this resource. This gives us the ability to create hierarchical or linked structures to represent complex combinations. For example, a parent resource can have source tables, a workflow, and a table schema that all combine to create a fully-realized, strongly typed, and transformed output table. Entire Resource objects may be embedded here, or a string path to the Resource definition JSON.

<b>Signature:</b>

```typescript
sources?: (string | ResourceSchema)[];
```
