/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const content =
	"# unfold\n\nReverses a [fold](./fold.md) operation. This is similar to a [pivot](./pivot.md), but pivot performs an aggregate when inverting the operation, rather than restoring the original rows.\n\n## Example\n\n| key  | value |\n| ---- | ----- |\n| id   | 1     |\n| name | Bob   |\n| id   | 2     |\n| name | Joe   |\n| id   | 3     |\n| name | Jenny |\n\n`fold key['id'] value['name']`:\n\n| id  | name  |\n| --- | ----- |\n| 1   | Bob   |\n| 2   | Joe   |\n| 3   | Jenny |\n"
export default content
