<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [NodeBinding](./workflow.nodebinding.md)

## NodeBinding interface

A binding for a value being emitted from a node

<b>Signature:</b>

```typescript
export interface NodeBinding<T> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [input?](./workflow.nodebinding.input.md) |  | [SocketName](./workflow.socketname.md) | <i>(Optional)</i> The named input on the target node (otherwise default) |
|  [node](./workflow.nodebinding.node.md) |  | Node&lt;T&gt; | The source node to bind data from |
