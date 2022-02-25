/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# merge\n\nCollapses multiple columns into one. Invalid values (null, undefined, NaN) are ignored.\n\nAvailable collapse strategies are:\n\n- first one wins: the first valid column value is used in the output\n- last one winss: the last valid column value is used in the output\n- concat: all valid column values are concatenated together\n\n## Examples\n\n| first | middle | last     |\n| ----- | ------ | -------- |\n| John  | Ray    | Doe      |\n| Bill  |        | Williams |\n|       | Colin  | Jeeves   |\n\n`merge columns['first', 'middle', 'last'], strategy='first one wins', to_column='output'`:\n\n| output |\n| ------ |\n| John   |\n| Bill   |\n| Colin  |\n\n`merge column['first'] with column['last'], strategy='last one wins', to_column='output'`:\n\n| output   |\n| -------- |\n| Doe      |\n| Williams |\n| Jeeves   |\n\n`merge column['first'] with column['last'], strategy='concat', to_column='output'`:\n\n| output        |\n| ------------- |\n| John Ray Doe  |\n| Bill Williams |\n| Colin Jeeves  |\n"
export default content
