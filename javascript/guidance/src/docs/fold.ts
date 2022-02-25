/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# fold\n\nTakes a list of input columns and folds them into a new pair of `[key, value]` columns. The output name of the `key` and `value` columns can be customized. Use [unfold](./unfold.md) to reverse a fold operation, or [pivot](./pivot.md) to invert it with aggregation.\n\n## Example\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Jenny |\n\n`fold columns['id', 'name']`:\n\n| key  | value |\n| ---- | ----- |\n| id   | 1     |\n| name | Bob   |\n| id   | 2     |\n| name | Joe   |\n| id   | 3     |\n| name | Jenny |\n"
export default content
