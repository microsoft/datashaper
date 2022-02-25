/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# intersect\n\nSet operation between an input table and one or more secondary tables, retaining only those rows that occur in all tables.\n\n## Example\n\ninput 1\n\n| id  |\n| --- |\n| 1   |\n| 2   |\n\ninput 2\n\n| id  |\n| --- |\n| 1   |\n| 3   |\n| 4   |\n\n`intersect table['input 1'] with table['input 2']`:\n\n| id  |\n| --- |\n| 1   |\n"
export default content
