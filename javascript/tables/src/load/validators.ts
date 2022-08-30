/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function validateCharacterLength(char?: string, length = 1) {
	return char ? char.length === length : true
}
