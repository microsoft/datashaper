<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/schema](./schema.md) &gt; [SpreadArgs](./schema.spreadargs.md)

## SpreadArgs interface

<b>Signature:</b>

```typescript
export interface SpreadArgs extends InputColumnArgs 
```
<b>Extends:</b> [InputColumnArgs](./schema.inputcolumnargs.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [delimiter?](./schema.spreadargs.delimiter.md) |  | string | <i>(Optional)</i> Delimiter to use when converting string cell values into an array with String.split |
|  [onehot?](./schema.spreadargs.onehot.md) |  | boolean | <i>(Optional)</i> Indicates that a onehot-style spread should be performed. This maps all unique cell values to new columns and sets the output cell value to a binary 1/0 based on column match. This is in contrast to the default spread, which just maps array values to column by index. |
|  [preserveSource?](./schema.spreadargs.preservesource.md) |  | boolean | <i>(Optional)</i> Keep the original columns (default is to remove source columns). |
|  [to](./schema.spreadargs.to.md) |  | string\[\] |  |

