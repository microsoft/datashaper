/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function bool(value?: any): boolean {
	return value === 'false' ? false : !!value
}
