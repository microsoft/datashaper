<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Configurable](./workflow.configurable.md)

## Configurable interface

Implement this to signal that your resource is configurable. Implementors must supply their own management of the config object/observable. See the webapp's TestAppResource for an example.

<b>Signature:</b>

```typescript
export interface Configurable<T = unknown> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [config](./workflow.configurable.config.md) |  | T |  |
|  [config$](./workflow.configurable.config_.md) |  | Observable&lt;T&gt; |  |

