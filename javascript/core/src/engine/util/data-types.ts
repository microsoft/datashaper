/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Check true/false for a boolean using nullable and parsed data criteria
 * https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#boolean-values
 * @param value
 * @returns
 */
export function bool(value?: any): boolean | null {
	// TODO: implement full suite of pandas rules
	if (value === null || value === undefined) {
		return null
	}
	return value === 'false' ? false : !!value
}
