/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { DropdownOptionSelect } from '../index.js'

export function useCellDropdownSelectHandler(
	clickable: boolean,
	onOptionSelect?: DropdownOptionSelect,
): DropdownOptionSelect | undefined {
	return useMemo(
		() =>
			clickable
				? (evt?, column?) => onOptionSelect && onOptionSelect(evt, column)
				: undefined,
		[clickable, onOptionSelect],
	)
}
