/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'

export function usePlaceholderValues(values: IDropdownOption[]): string {
	return useMemo(
		() =>
			values
				.slice(0, 10)
				.map((value: IDropdownOption) => value.text)
				.join(', ') || 'Open to see the values',
		[values],
	)
}
