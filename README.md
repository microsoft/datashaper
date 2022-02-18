# data-wrangling-components

This project provides a collection of web components for doing lightweight data wrangling.

There are four goals of the project:

1.  Create a shareable client/server schema for serialized wrangling instructions
2.  Maintain an implementation of a basic client-side wrangling engine (largely based on [Arquero](https://github.com/uwdata/arquero))
3.  Maintain a python implementation using common wrangling libraries (e.g., [pandas](https://pandas.pydata.org/)) for backend or data science deployments
4.  Provide some reusable React components so wrangling operations can be incorporated into webapps easily.

The first goal is nascent, and currently covered by TypeScript typings in the core javascript package. However, our intent is to eventually extract a JSONSchema specification that is more readily consumable by cross-platform services. In addition, our API largely mirrors Arquero's for now; we'll review for areas of parameter commonality and make some generalizations in the future.

Individual documentation for the JavaScript and Python implementations can be found in their respective folders. Broad documentation about building pipelines and the available verbs is available in the [docs](docs) folder

We currently have four packages:

- [core](packages/core) - this is the primary engine for pipeline execution. It includes low-level operational primitives to execute a wide variety of relational algebra transformations over Arquero tables. The pipeline is essentially an implementation of async chain-of-command, executing verbs serially based on an input table context and set of step configurations.
- [react](packages/react) - this is a set of React components for each verb that you can include in web apps that enable tranformation pipeline building.
- [utilities](packages/utilities) - this is a set of helpers for working with files, etc., to ease building data wrangling applications.
- [webapp](packages/webapp) - this is an example/test webapp that includes all of the verb components and allows creation, execution, and saving of pipeline JSON files.

## Building

- You need node and yarn installed
- Run: `yarn`
- Then: `yarn build`
- Run the webapp locally: `yarn start`

## Usage

The webapp uses both the core engine and React components to build a small application that demonstrates how to use the wrangling components. At a basic level, you need a set of input tables, which you place in a TableStore (basically a chain execution context). You add wrangling steps to a Pipeline, then run it to generate an output table.

Tables in the store are referenced by key. Steps can create any number of output tables that are also written to the store. Future steps can therefore build upon previous/intermediate outputs however you'd like. See the [every-operation.json](packages/webapp/src/pages/MainPage/specs/every-operation.json) example for a sample of every verb we currently support.

Example joining two tables:

```
    import { table } from 'arquero'
    import { createTableStore, Pipeline } from '@data-wrangling-components/core'

    // id   name
    // 1    bob
    // 2    joe
    // 3    jane
    const parents = table({
        id: [1, 2, 3],
        name: ['bob', 'joe', 'jane']
    })

    // id   kid
    // 1    billy
    // 1    jill
    // 2    kaden
    // 2    kyle
    // 3    moe
    const kids = table({
        id: [1, 1, 2, 2, 3],
        kid: ['billy', 'jill', 'kaden', 'kyle', 'moe]
    })

    const store = createTableStore()

    store.set({
        id: 'parents',
        table: parents
    })
    store.set({
        id: 'kids',
        table: kids
    })

	const pipeline = new Pipeline(store)

    pipeline.add({
        verb: 'join',
        input: 'parents',
        output: 'output',
        args: {
            other: 'kids',
            on: ['id']
        }
    })

    // id   name    kid
    // 1    bob     billy
    // 1    bob     jill
    // 2    joe     kaden
    // 2    joe     kyle
    // 3    jane    moe
    const result = await pipeline.run()

```

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
