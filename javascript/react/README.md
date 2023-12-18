# react

This package contains a collection of React components for constructing wrangling pipeline interfaces. All of the core components used in our [complete webapp](../webapp/) are stored here, such as fundamental verb configuration forms, table renderers, etc.

Some of these components can be useful for data-driven apps even if they do not need to perform wrangling or build pipelines. For example, the [ArqueroDetailsList](./docs/markdown/react.arquerodetailslistprops.md) is a standard [Fluent DetailsList](https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist) that accepts an [Arquero table](https://uwdata.github.io/arquero/api/table) instead of the usual `items` array, and it automatically renders it richly and with various data display options.

Many of the components (including every verb configuration form) have stories that can be viewed in Storybook. Run the project locally to see these stories and use them during development, or view the latest on [GitHub](https://microsoft.github.io/datashaper/storybook/).

## Verb forms

To create a new verb form component for use in the application, a few steps need to be taken:

1. An implementation of the verb needs to exist in the [workflow](../workflow/) package.
2. A form component needs to be written; these are in [src/components/verbs](./src/components/verbs/). Any React component can be written as long as it binds change events to the workflow instance. We have a number of helpers and form templates to make this easier, see other verbs for examples. Ensure that `selectStepForm` has a mapping to bind the verb name to a form.
3. A verb description needs to be written. This is a read-only summary of the verb parameters, usable for applications to display a concise printout of the pipeline, and also used in the stories to verify input mappings are correct. Ensure that `selectStepDescription` has a mapping to bind the verb name to a description.
4. At minimum, add an entry in the [every operation](./src/components/verbs/__tests__/specs/every-operation.json) story to see the verb component and description rendered. If multiple permutations are desired, create a new [story](./src/components/verbs/__tests__/).