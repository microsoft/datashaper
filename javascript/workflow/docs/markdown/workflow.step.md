<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Step](./workflow.step.md)

## Step interface

Resolved step data, used in living workflows

<b>Signature:</b>

```typescript
export interface Step<T extends object | void | unknown = unknown> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [args](./workflow.step.args.md) |  | T | The verb arguments |
|  [description?](./workflow.step.description.md) |  | string | <i>(Optional)</i> |
|  [id](./workflow.step.id.md) |  | string | A unique identifier for this step |
|  [input](./workflow.step.input.md) |  | { source?: InputBinding; others?: InputBinding\[\]; \[key: string\]: InputBinding \| InputBinding\[\] \| undefined; } | The bound inputs Key = Input Socket Name Value = Socket Binding to other node |
|  [verb](./workflow.step.verb.md) |  | Verb | The verb being execute |

