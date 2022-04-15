/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { noop } from '@data-wrangling-components/primitives'
import { useMemo } from 'react'

import type { DropdownOptionSelect } from '../index.js'

export function useCellDropdownSelectHandler(
	clickable: boolean,
	onOptionSelect: DropdownOptionSelect = noop,
): DropdownOptionSelect | undefined {
	return useMemo(
		() => (clickable ? onOptionSelect : undefined),
		[clickable, onOptionSelect],
	)
}
