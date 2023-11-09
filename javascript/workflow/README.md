# workflow

This package contains the core execution engine and verb implementations for our client-side pipelines. Specifically, the workflow engine reads a JSON schema definition for a pipeline, instantiates a reactive processing graph using RXJS, and then applies it to incoming data tables. The [react](../react/) package contains a variety of hooks and other components to bind this core processing flow to web UX.

Arquero is used as our core client-side table processing engine; therefore our verbs are largely wrappers around Arquero verbs (sometimes with syntactic sugar or simplification).

## Verb implementations

Verb impls reside at [src/verbs](./src/verbs/). This is basically a collection of functions that execute Arquero verbs.

NOTE: some of these map to higher-order logic we desire that may
actually be compound verbs or specific outputs. In particular,
`binarize` and `aggregate` are not actual Arquero verbs.

Also note that most of these do not implement the full Arquero API with all arguments.
In some cases this is because we don't need the functionality yet, and in many cases
it is simply because Arquero provides multiple input format options and we just chose
one to simplify our specification arguments.

See the [docs](../../docs/) package for more general documentation about the verbs.

### Creating verbs

To create a new client-side verb, a few steps need to be taken:

1. Create an implementation in the verbs src folder. This should export a function named the same as the verb itself. Note that scoped verbs should be put into subfolders and exported successively, so they form a nested export object (see `strings` for example).
2. A set of default args needs to be supplied. This is done by creating a mapping in the `defaults` folder. See index.ts for examples, including verbs that don't have any params, or have things like shared defaults. Again, see `strings` as an example for scoped verbs.
3. If you need UX for creating and editing the new verb, head over to the [react](../react/) package and see the instructions there.