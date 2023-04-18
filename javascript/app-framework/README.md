# app-framework

The DataShaper app-framework package provides infrastructure for creating new applications that include core DataShaper functionality by default, as well as extensibility to build your own interfaces that are managedby the system consistently.

## Resources

The fundamental application unit we use is a `Resource`, modeled after the Resource definition in [frictionless](https://specs.frictionlessdata.io/data-resource/). Resources are bundled together into a `DataPackage`, which can be loaded or saved as a zipped file. See the [schema](../schema/) package for extensive details on the standard resources built into DataShaper.

By extending the Resource interface (up to and including your own standard JSONSchema definitions for validation), your application can add new content and views within a DataShaper app, with helpers for serialization, file and state management, rendering, and so on. Two helpful examples for understanding this structure are [the DataShaper webapp](./webapp) in this repository, which includes a test resource example, and [ShowWhy](https://specs.frictionlessdata.io/data-resource/), a no-code causal inference tool that establishes custom resources for building and executing causal models.

Resource schemas define the properties any resource can contain, and you may have as many resource _instances_ as you like within an app: every data table, transformation pipeline, etc. are all resource instances.

## AppProfiles

To define how resources are managed within the app-framework, you need to define an `AppProfile`. Each resource definition is required to provide a globally unique `profile` key, and the AppProfile interface contains standard methods that you can implement to define consistent behavior. This operates much like the classic [command pattern](https://en.wikipedia.org/wiki/Command_pattern), with our application instantiating, interrogating, and ultimately executing these definitions. For example, AppProfiles can define the set of command bar items to display in the global file menu, and are required to supply a renderer that returns a React component for its primary view.

### Properties

Several static properties exist which are used to define visual display and organization. These are described in detail in the [interface](./src/types.ts#AppProfile).

### Methods

Here we will focus on a handful of the optional methods to show how basic setup can be performed.

`getCommandBarCommands`: This returns a list of command entries (Fluent IContextualMenuItem instances) to display in the top-level file menu. If present on your profile, this function will be called for each standard menu group (New, Open, Save), and you can return an array of IContextualMenuItem that will be rendered. From here you can do whatever you'd like in the onClick handlers.

`getFieldWells`: The field wells mechanism provides a way to define fillable wells as children of your resource entry in the file tree. This is modeled after similar functionality in Power BI. If you provide field wells, they will be rendered as dropdowns that allow you to select matching resources from the current data package to bind as sources for the resource. For example, if you have a resource that requires an input table, you can define this as a field well for users to select the input table they want to use. This mechanism enables consistent UX for binding required sources within a resource instance. See the TestApp for an example of how this works.

`getSettingsConfig`: If your resource implements the `Configurable` interface you can manage arbitrary blocks of config that are rendered in a consistent location for the user. Note that you have ultimately flexibility to render whatever you'd like in the main view of your resource; the settings option allows you to push advanced or lesser-used to a common location outside of the main view. The getSettingsConfig method is how you return an object that defines all of these available settings and how they are managed (for example, a text field can use a plain textfield or instead have a list of options to render in a dropdown). New resource instances are expected to instantiate the default settings from this config, and will gain an entry in the settings dialog where that instance's settings can be updated by the user. Once again, the TestApp demonstrates how to do this with a simple configuration object.