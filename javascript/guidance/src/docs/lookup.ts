/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# lookup\n\nSimilar to [join](./join.md). The primary difference is that all rows in the input table are preserved, and only values from specified columns in the secondary table are copied. If more than one row in the secondary table matches, the last value found will be copied.\n\n## Example\n\ninput 1\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Jenny |\n\ninput 2\n\n| id  | login_date |\n| --- | ---------- |\n| 1   | 2022-01-01 |\n| 2   | 2022-01-01 |\n| 3   | 2022-01-01 |\n| 1   | 2022-01-03 |\n| 2   | 2022-01-05 |\n| 1   | 2022-01-08 |\n\n`lookup table['input 1'] with table['input 2'] on column['id'], copy columns['login_date']`:\n\n| id  | name  | login_date |\n| --- | ----- | ---------- |\n| 1   | Bob   | 2022-01-08 |\n| 2   | Joe   | 2022-01-05 |\n| 3   | Jenny | 2022-01-01 |\n"
export default content
