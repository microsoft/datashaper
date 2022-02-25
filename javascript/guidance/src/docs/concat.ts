/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# concat\n\nAppends additional tables to the input table, mimicking SQL UNION_ALL. Note that only columns from the input table are retained in the concatenated output.\n\n## Example\n\ninput 1\n\n| id  |\n| --- |\n| 1   |\n| 2   |\n\ninput 2\n\n| id  | Name |\n| --- | ---- |\n| 3   | Bob  |\n| 4   | Joe  |\n\n`concat table['input 1'] with table['input 2']`:\n\n| id  |\n| --- |\n| 1   |\n| 2   |\n| 3   |\n| 4   |\n"
export default content
