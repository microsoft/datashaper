/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# orderby\n\nApplies a sort operation on the table using a specified column and sort direction. Multiple column + direction instructions can be supplied to produce a compound sort.\n\n## Example\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Jenny |\n\n`orderby column['name'], direction='desc'`:\n\n| id  | name  |\n| --- | ----- |\n| 2   | Joe   |\n| 3   | Jenny |\n| 1   | Bob   |\n"
export default content
