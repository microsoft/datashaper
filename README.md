# DataShaper

This project provides a collection of components for executing processing pipelines, particularly oriented to data wrangling. Detailed documentation is provided in subfolders, with an overview of high-level goals and concepts here. Most of the documentation within individual packages is tailored to developers needing to understand how the code is organized and executed. Higher-level concepts for the project as a whole, constructing workflows, etc. are in the root [docs](./docs/) folder.

## Motivation

There are four primary goals of the project:

1.  Create a shareable client/server schema for describing data processing steps. This is in the [schema](./schema) folder. TypeScript types and JSONSchema generation is in [javascript/schema](./javascript/schema), and published schemas are copied out to [schema](./schema) along with test cases that are executed by JavaScript and Python builds to ensure parity. Stable released versions of DataShaper schemas are hosted on github.io for permanent reference (described below).
2.  Maintain an implementation of a basic client-side wrangling engine (largely based on [Arquero](https://github.com/uwdata/arquero)). This is in the [javascript/workflow](./javascript/workflow) folder. This contains a reactive execution engine, along with individual verb implementations.
3.  Maintain a python implementation using common wrangling libraries (e.g., [pandas](https://pandas.pydata.org/)) for backend or data science deployments. This is in the [python](./python) folder. The execution engine is less complete than in JavaScript, but has complete verb implementations and test suite parity. A fuller-featured generalized pipeline execution engine is forthcoming.
4.  Provide an application framework along with some reusable React components so wrangling operations can be incorporated into web applications easily. This is in the [javascript/app-framework](./javascript/app-framework) and [javascript/react](./javascript/react) folders.

Individual documentation for the JavaScript and Python implementations can be found in their respective folders. Broad documentation about building pipelines and the available verbs is available in the [docs](docs) folder.

We currently have seven primary JavaScript packages:

- [app-framework](javascript/app-framework/docs/markdown/index.md) - this provides web application infrastructure for creating data-driven apps with minimal boilerplate.
- [react](javascript/react/docs/markdown/index.md) - this is a set of React components for each verb that you can include in web apps that enable transformation pipeline building.
- [schema](javascript/schema/docs/markdown/index.md) - this is a set of core types and associated JSONSchema definitions for formalizing our data package and resource models (including the definitions for table parsing, Codebooks, and Workflows).
- [tables](javascript/tables/docs/markdown/index.md) - this is the primary set of functions for loading and parsing data tables, using Arquero under the hood.
- [utilities](javascript/utilities/docs/markdown/index.md) - this is a set of helpers for working with files, etc., to ease building data wrangling applications.
- [webapp](javascript/webapp) - this is the deployable DataShaper webapp that includes all of the verb components and allows creation, execution, and saving of pipeline JSON files. We also rely on this to demonstrate example code, including a TestApp profile. If you're wondering how to build an app with DataShaper components, start here!
- [workflow](javascript/workflow/docs/markdown/index.md) - this is the primary engine for pipeline execution. It includes low-level operational primitives to execute a wide variety of relational algebra transformations over Arquero tables.

Also note that each JavaScript package has a generated docs folder containing Markdown API documentation extracted from code comments using [api-extractor](https://api-extractor.com/).

The Python packages are much simpler, because there is no associated web application and component code.

- [engine](./python/datashaper/datashaper/engine/) - contains the core verb implementations.
- [workflow.py](./python/datashaper/datashaper/workflow.py) - this is the primary execution engine that loads and interprets pipelines, and iterates through the steps to produce outputs.


## Schema management

We generate JSONSchema for formal project artifacts including resource definitions and workflow specifications. This allows validation by any consumer and/or implementor. Schema versions are published on github.io for permanent reference. Each variant of a schema is hosted in perpetuity with semantic versioning. Aliases to the most recent (unversioned latest) and major revisions are also published. Here are direct links to the latest versions of our primary schemas:

- Bundle ([types](./javascript/schema/src/bundle/)) ([published schema](https://microsoft.github.io/datashaper/schema/bundle/bundle.json))
- Codebook ([types](./javascript/schema/src/codebook/)) ([published schema](https://microsoft.github.io/datashaper/schema/codebook/codebook.json))
- Data Package ([types](./javascript/schema/src/datapackage/)) ([published schema](https://microsoft.github.io/datashaper/schema/datapackage/datapackage.json))
- Data Table ([types](./javascript/schema/src/datatable/)) ([published schema](https://microsoft.github.io/datashaper/schema/datatable/datatable.json))
- Table Bundle ([types](./javascript/schema/src/tablebundle/)) ([published schema](https://microsoft.github.io/datashaper/schema/tablebundle/tablebundle.json))
- Workflow ([types](./javascript/schema/src/workflow/)) ([published schema](https://microsoft.github.io/datashaper/schema/workflow/workflow.json))

Note that for the purposes of pipeline development, the `workflow` schema is primary. The rest are largely used for package management and table bundling in the web application.

## Creating new verbs

For new verbs within the DataShaper toolkit, you must first determine if JavaScript and Python parity is desired. For operations that should be configurable via a UX, a JavaScript implementation is necessary. However, if the verb is primarily useful for data science workflows and has potentially complicated parameters, a Python-only implementation may be fine. We have a preference for parity to reduce confusion and allow for cross-platform execution of any pipelines created with the tool, but also recognize the value of the Python-based execution engine for configuring data science and ETL workflows that will only ever be run server-side.

### Core verbs

Core verbs are built into the toolkit, and should generally have JavaScript and Python parity. Creating these verbs involves the following steps:

1. Schema definition - this is done by authoring TypeScript types in the [javascript/schema](./javascript/schema/) folder, which are then generated as JSONSchema during a build step.
2. Cross-platform tests - these are defined in [schema/fixtures](./schema/fixtures), primarily in the workflow folder. Each fixture includes a workflow.json and an expected output csv file. Executors run in both JavaScript and Python to confirm that outputs match the expected table.
3. JavaScript implementation - verbs are implemented in [javascript/workflow/verbs](./javascript/workflow/src/verbs/)
4. Verb UX - individual verb UX components are in [javascript/react](./javascript/react/src/components/verbs/)

#### Python implementation
1. Verbs are implemented in [python/verbs](./python/datashaper/datashaper/engine/verbs/)
2. Create a verb file following the json schema as package structure, for example, if in the schema the verbs is defined as:
```json
"verb": {
    "const": "strings.upper",
    "type": "string"
}
```
The location of the verb must be in [datashaper.engine.verbs.strings.upper](./python/datashaper/datashaper/engine/verbs/strings/upper.py).

3. Create a function that replicates the same functionality as the javascript version and use the `@verb` decorator to make it available to the Workflow engine. The `name` parameter of the decorator must match the package name defined in the schema. For example:
```python
@verb(name="strings.upper")
def upper(input: VerbInput, column: str, to: str):
    ...
```

### Custom verbs

The Python implementation supports the use of custom verbs supplied by your application - this allows arbitrary processing pipelines to be built that contain custom logic and processing steps.

> TODO: document custom verb format

## Build and test

JavaScript
- You need node and yarn installed
- Operate from project root
- Run: `yarn`
- Then: `yarn build`
- Run the webapp locally: `yarn start`

Python
- You need Python and poetry installed
- Operate from [python/datashaper](./python/datashaper/) folder
- Run: `poetry install`
- Then: `poetry run poe test`

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
