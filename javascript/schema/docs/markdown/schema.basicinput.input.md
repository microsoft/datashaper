<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/schema](./schema.md) &gt; [BasicInput](./schema.basicinput.md) &gt; [input](./schema.basicinput.input.md)

## BasicInput.input property

Standard step input; single source with default name "source".

If undefined, the default output of the previous step will be used (if available). If no previous step is available, this will remain undefined

<b>Signature:</b>

```typescript
input?: string | {
        source: PortBinding;
    };
```