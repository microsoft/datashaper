<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/app-framework](./app-framework.md) &gt; [ProfilePlugin](./app-framework.profileplugin.md) &gt; [getRoutes](./app-framework.profileplugin.getroutes.md)

## ProfilePlugin.getRoutes property

Event handler for when the resource is undergoing route generation. A route is always generated for the resource; any related routes may be retured here.

<b>Signature:</b>

```typescript
getRoutes?: (resource: T, parentPath: string, resourcePath: string) => GeneratedExtraRoutes | undefined;
```