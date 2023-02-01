<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Readable](./workflow.readable.md)

## Readable type

<b>Signature:</b>

```typescript
export type Readable<T extends ResourceSchema> = {
    profile?: T['profile'] | undefined;
    name?: T['name'] | undefined;
} & Omit<T, 'profile' | 'name' | '$schema'>;
```