/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# select\n\nSelects only the specified list of columns into a new table.\n\nExample\n\n| id  | name  | age |\n| --- | ----- | --- |\n| 1   | Bob   | 32  |\n| 2   | Joe   | 35  |\n| 3   | Jenny | 31  |\n\n`select columns['id', 'age']`:\n\n| id  | age |\n| --- | --- |\n| 1   | 32  |\n| 2   | 35  |\n| 3   | 31  |\n"
export default content
