<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Workflow](./workflow.workflow.md)

## Workflow class

<b>Signature:</b>

```typescript
export declare class Workflow extends Resource implements SchemaResource<WorkflowSchema> 
```
<b>Extends:</b> [Resource](./workflow.resource.md)

<b>Implements:</b> [SchemaResource](./workflow.schemaresource.md)<!-- -->&lt;WorkflowSchema&gt;

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(input, \_strictInputs)](./workflow.workflow._constructor_.md) |  | Constructs a new instance of the <code>Workflow</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [$schema](./workflow.workflow._schema.md) | <code>readonly</code> | string |  |
|  [inputNames](./workflow.workflow.inputnames.md) | <code>readonly</code> | Set&lt;string&gt; |  |
|  [inputs](./workflow.workflow.inputs.md) | <code>readonly</code> | Map&lt;string, TableSubject&gt; |  |
|  [length](./workflow.workflow.length.md) | <code>readonly</code> | number |  |
|  [outputDefinitions](./workflow.workflow.outputdefinitions.md) | <code>readonly</code> | NamedOutputPortBinding\[\] |  |
|  [outputNames](./workflow.workflow.outputnames.md) | <code>readonly</code> | string\[\] | Gets the output table names |
|  [outputPorts](./workflow.workflow.outputports.md) | <code>readonly</code> | Map&lt;string, NamedOutputPortBinding&gt; |  |
|  [steps](./workflow.workflow.steps.md) | <code>readonly</code> | [Step](./workflow.step.md)<!-- -->\[\] |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [addInputName(input)](./workflow.workflow.addinputname.md) |  |  |
|  [addInputObservable(id, source)](./workflow.workflow.addinputobservable.md) |  | Add a named input |
|  [addInputObservables(values)](./workflow.workflow.addinputobservables.md) |  | Add a named input |
|  [addInputTable(table, id)](./workflow.workflow.addinputtable.md) |  | Add a named input |
|  [addInputTables(inputs)](./workflow.workflow.addinputtables.md) |  |  |
|  [addOutput(output)](./workflow.workflow.addoutput.md) |  | Add an output binding |
|  [addStep(stepInput)](./workflow.workflow.addstep.md) |  | Adds a step to the pipeline |
|  [getInputTable(name)](./workflow.workflow.getinputtable.md) |  |  |
|  [hasInputName(input)](./workflow.workflow.hasinputname.md) |  |  |
|  [hasOutput(name)](./workflow.workflow.hasoutput.md) |  |  |
|  [hasOutputName(name)](./workflow.workflow.hasoutputname.md) |  |  |
|  [latestOutput(name)](./workflow.workflow.latestoutput.md) |  | Get the latest output value |
|  [latestOutputForNode(nodeId, nodeOutput)](./workflow.workflow.latestoutputfornode.md) |  |  |
|  [loadSchema(schema, quiet)](./workflow.workflow.loadschema.md) |  |  |
|  [outputNameForNode(nodeId, nodeOutput)](./workflow.workflow.outputnamefornode.md) |  |  |
|  [outputObservable(name)](./workflow.workflow.outputobservable.md) |  | Observe an output name |
|  [outputObservableForNode(nodeId, nodeOutput)](./workflow.workflow.outputobservablefornode.md) |  |  |
|  [removeInputName(input)](./workflow.workflow.removeinputname.md) |  |  |
|  [removeInputObservable(id)](./workflow.workflow.removeinputobservable.md) |  |  |
|  [removeOutput(name)](./workflow.workflow.removeoutput.md) |  | Remove an output binding |
|  [removeStep(index)](./workflow.workflow.removestep.md) |  |  |
|  [suggestOutputName(name)](./workflow.workflow.suggestoutputname.md) |  |  |
|  [toArray(includeInputs)](./workflow.workflow.toarray.md) |  |  |
|  [toMap(includeInputs)](./workflow.workflow.tomap.md) |  | Gets a map of the current output tables |
|  [toSchema()](./workflow.workflow.toschema.md) |  |  |
|  [updateStep(stepInput, index)](./workflow.workflow.updatestep.md) |  |  |
|  [validate(workflowJson)](./workflow.workflow.validate.md) | <code>static</code> |  |
