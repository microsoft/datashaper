/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# impute\n\nFills in any invalid values with a specified value. Invalid values include NaN, null, and undefined. The opposite of [erase](./erase.md)\n\n## Example\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | null  |\n| 4   | Jenny |\n| 5   | null  |\n\n`impute column['name'] with value='Doe'`:\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Doe   |\n| 4   | Jenny |\n| 5   | Doe   |\n"
export default content
