This is a collection of functions that execute Arquero verbs.

NOTE: some of these map to higher-order logic we desire that may
actually be compound verbs or specific outputs. In particular,
`binarize` and `aggregate` are not actual Arquero verbs.

Also note that most of these do not implement the full Arquero API with all arguments.
In some cases this is because we don't need the functionality yet, and in many cases
it is simply because Arquero provides multiple input format options and we just chose
one to simplify our specification arguments.

See the [docs](../../../../../docs/) package for more general documentation about the verbs.
