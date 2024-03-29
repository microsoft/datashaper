<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [DefaultGraph](./workflow.defaultgraph.md)

## DefaultGraph class

<b>Signature:</b>

```typescript
export declare class DefaultGraph<T> implements Graph<T> 
```
<b>Implements:</b> [Graph](./workflow.graph.md)<!-- -->&lt;T&gt;

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [nodes](./workflow.defaultgraph.nodes.md) | <code>readonly</code> | [NodeId](./workflow.nodeid.md)<!-- -->\[\] | Get a list of NodeIDs |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [add(node)](./workflow.defaultgraph.add.md) |  | Add a node to the graph |
|  [clear()](./workflow.defaultgraph.clear.md) |  | Clear the graph and remove all nodes |
|  [hasNode(id)](./workflow.defaultgraph.hasnode.md) |  | Check if the graph has a node with the given ID |
|  [node(id)](./workflow.defaultgraph.node.md) |  | Get a node by id |
|  [printStats()](./workflow.defaultgraph.printstats.md) |  | Print per-node stats of the graph |
|  [remove(removeId)](./workflow.defaultgraph.remove.md) |  | Remove a node by ID from the graph |
|  [validate()](./workflow.defaultgraph.validate.md) |  | Validate the graph, checking for any cycles |

