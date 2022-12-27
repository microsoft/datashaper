<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Workflow](./workflow.workflow.md) &gt; [toMap](./workflow.workflow.tomap.md)

## Workflow.toMap() method

Gets a map of the current output tables

<b>Signature:</b>

```typescript
toMap({ includeDefaultInput, includeDefaultOutput, includeInputs, }?: TableExportOptions): Map<string, Maybe<TableContainer>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  { includeDefaultInput, includeDefaultOutput, includeInputs, } | [TableExportOptions](./workflow.tableexportoptions.md) | <i>(Optional)</i> |

<b>Returns:</b>

Map&lt;string, [Maybe](./workflow.maybe.md)<!-- -->&lt;TableContainer&gt;&gt;

The output cache
