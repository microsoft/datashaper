<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/schema](./schema.md) &gt; [Field](./schema.field.md) &gt; [mapping](./schema.field.mapping.md)

## Field.mapping property

This provides a mapping between cell values and some other value. Most commonly this is the core "data dictionary", whereby cell values are stored as numeric categories, and the dictionary defines textual descriptions of the actual meaning. If numeric, the keys are usually categorical ordinal or nominal. String keys are often commonly used (for example, medical data often use short alphanumeric codes to represent diagnostic strings).

<b>Signature:</b>

```typescript
mapping?: Record<any, any>;
```