/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'

import { getEnumDropdownOptions } from '../enums.js'

export function useEnumDropdownOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	return useMemo(
		() => getEnumDropdownOptions(enumeration, labels),
		[enumeration, labels],
	)
}
