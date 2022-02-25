/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# erase\n\nClears cell values that match a specific value. The opposite of [impute](./impute.md)\n\n## Example\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Jenny |\n\n`erase column['name'] with value='Jenny'`:\n\n| id  | name |\n| --- | ---- |\n| 1   | Bob  |\n| 2   | Joe  |\n| 3   |      |\n"
export default content
