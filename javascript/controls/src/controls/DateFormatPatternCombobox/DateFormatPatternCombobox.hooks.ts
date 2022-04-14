/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'

export function useDateFormatPatternOptions(): IDropdownOption[] {
	const formatPatternArray: IDropdownOption[] = [
		{ key: '%Y-%m-%d', text: '%Y-%m-%d' },
		{ key: '%Y/%m/%d', text: '%Y/%m/%d' },
		{ key: '%B %d, %Y', text: '%B %d, %Y' },
		{ key: '%m-%d-%Y', text: '%m-%d-%Y' },
		{ key: '%m/%d/%Y', text: '%m/%d/%Y' },
		{ key: '%d-%m-%Y', text: '%d-%m-%Y' },
		{ key: '%d/%m/%Y', text: '%d/%m/%Y' },
		{ key: '%Y-%m-%dT%H:%M:%S.%LZ', text: 'ISO 8601 (%Y-%m-%dT%H:%M:%S.%LZ)' },
	]
	return formatPatternArray
}
