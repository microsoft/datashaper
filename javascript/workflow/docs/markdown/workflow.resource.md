<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/workflow](./workflow.md) &gt; [Resource](./workflow.resource.md)

## Resource class

<b>Signature:</b>

```typescript
export declare abstract class Resource extends Named implements ResourceSchema, Resource 
```
<b>Extends:</b> [Named](./workflow.named.md)

<b>Implements:</b> ResourceSchema, [Resource](./workflow.resource.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [$schema](./workflow.resource._schema.md) | <code>readonly</code> | string \| undefined | Gets the resource schema |
|  [dataPackage](./workflow.resource.datapackage.md) | <code>protected</code> | [DataPackage](./workflow.datapackage.md) \| undefined |  |
|  [homepage](./workflow.resource.homepage.md) |  | string \| undefined |  |
|  [isConnected](./workflow.resource.isconnected.md) | <code>readonly</code> | boolean |  |
|  [license](./workflow.resource.license.md) |  | string \| undefined |  |
|  [path](./workflow.resource.path.md) |  | ResourceSchema\['path'\] |  |
|  [profile](./workflow.resource.profile.md) | <code>readonly</code> | Profile \| undefined | Gets the resource profile |
|  [rel](./workflow.resource.rel.md) |  | ResourceSchema\['rel'\] |  |
|  [sources](./workflow.resource.sources.md) |  | ([Resource](./workflow.resource.md) \| [ResourceReference](./workflow.resourcereference.md)<!-- -->)\[\] |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [connect(dp, top)](./workflow.resource.connect.md) |  | Connects this resource to the given data package |
|  [defaultName()](./workflow.resource.defaultname.md) |  |  |
|  [dispose()](./workflow.resource.dispose.md) |  |  |
|  [getSourcesWithProfile(type)](./workflow.resource.getsourceswithprofile.md) |  | Gets the sources of this resource that match the given profile type |
|  [isReference()](./workflow.resource.isreference.md) |  |  |
|  [loadSchema(value, quiet)](./workflow.resource.loadschema.md) |  |  |
|  [toSchema()](./workflow.resource.toschema.md) |  |  |

