# react

This package contains a collection of React components for constructing wrangling pipeline interfaces. All of the core components used in our [complete webapp](../webapp/) are stored here, such as fundamental verb configuration forms, table renderers, etc.

Some of these components can be useful for data-driven apps even if they do not need to perform wrangling or build pipelines. For example, the [ArqueroDetailsList](./docs/markdown/react.arquerodetailslistprops.md) is a standard [Fluent DetailsList](https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist) that accepts an [Arquero table](https://uwdata.github.io/arquero/api/table) instead of the usual `items` array, and it automatically renders it richly and with various data display options.

Many of the components (including every verb configuration form) have stories that can be viewed in Storybook. Run the project locally to see these stories and use them during development, or view the latest on [GitHub](https://microsoft.github.io/datashaper/storybook/).