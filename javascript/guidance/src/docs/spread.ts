/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# spread\n\nUnrolls array-valued cells into new columns. Similar to [unroll](./unroll.md), but creating new columns instead of rows. New columns are created using the input column name plus array index. If an output columns list is supplied, any array cells with more values than the supplied output names will be truncated.\n\n## Example\n\n| id  | values      |\n| --- | ----------- |\n| 1   | [10, 15]    |\n| 2   | [1, 11, 18] |\n\n`spread column['values']`:\n\n| id  | values      | values_1 | values_2 | values_3 |\n| --- | ----------- | -------- | -------- | -------- |\n| 1   | [10, 15]    | 10       | 15       | null     |\n| 2   | [1, 11, 18] | 1        | 11       | 18       |\n\n`spread column['values'] to_columns=['first', 'second']`:\n\n| id  | values      | first | second |\n| --- | ----------- | ----- | ------ |\n| 1   | [10, 15]    | 10    | 15     |\n| 2   | [1, 11, 18] | 1     | 11     |\n"
export default content
