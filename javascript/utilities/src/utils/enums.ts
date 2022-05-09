/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function enumName(
	en: object,
	key?: string | number,
): string | undefined {
	const found = Object.entries(en).find(e => e[1] === key)
	return found && found[0]
}
