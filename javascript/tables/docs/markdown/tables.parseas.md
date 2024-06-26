<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/tables](./tables.md) &gt; [parseAs](./tables.parseas.md)

## parseAs() function

Factory function to create a value parser based on defined data type and type hints

<b>Signature:</b>

```typescript
export declare function parseAs(type?: DataType, hints?: TypeHints, subtype?: DataType): Value;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  type | DataType | <i>(Optional)</i> the datatype to interpret as |
|  hints | TypeHints | <i>(Optional)</i> type hinting information |
|  subtype | DataType | <i>(Optional)</i> the subtype of the datatype (i.e., if the main type is an array) |

<b>Returns:</b>

Value

A parsed value

