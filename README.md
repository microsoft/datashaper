# datashaper

This project provides a collection of web components for doing lightweight data wrangling.

There are four goals of the project:

1.  Create a shareable client/server schema for serialized wrangling instructions. This is in the ./schema folder. TypeScript types and JSONSchema generation is in javascript/schema, and published schemas are copied out to ./schema along with test cases that are executed by JavaScript and Python builds to ensure parity.
2.  Maintain an implementation of a basic client-side wrangling engine (largely based on [Arquero](https://github.com/uwdata/arquero)). This is in the ./javascript folder.
3.  Maintain a python implementation using common wrangling libraries (e.g., [pandas](https://pandas.pydata.org/)) for backend or data science deployments. This is in the ./python folder.
4.  Provide some reusable React components so wrangling operations can be incorporated into webapps easily. This is in the ./javascript/react folder.

Individual documentation for the JavaScript and Python implementations can be found in their respective folders. Broad documentation about building pipelines and the available verbs is available in the [docs](docs) folder

We currently have six primary JavaScript packages:

- [react](javascript/react/docs/markdown/index.md) - this is a set of React components for each verb that you can include in web apps that enable tranformation pipeline building.
- [schema](javascript/schema/docs/markdown/index.md) - this is a set of core types and associated JSONSchema definitions for formalizing our data package and resource models (including the definitions for table parsing, Codebooks, and Workflows).
- [tables](javascript/tables/docs/markdown/index.md) - this is the primary set of utilities for loading and parsing data tables, using Arquero under the hood.
- [utilities](javascript/utilities/docs/markdown/index.md) - this is a set of helpers for working with files, etc., to ease building data wrangling applications.
- [webapp](javascript/webapp/docs/markdown/index.md) - this is the deployable DataShaper that includes all of the verb components and allows creation, execution, and saving of pipeline JSON files.
- [workflow](javascript/workflow/docs/markdown/index.md) - this is the primary engine for pipeline execution. It includes low-level operational primitives to execute a wide variety of relational algebra transformations over Arquero tables.

## Building

- You need node and yarn installed
- Run: `yarn`
- Then: `yarn build`
- Run the webapp locally: `yarn start`

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
