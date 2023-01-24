/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldMetadata } from '@datashaper/schema'
import { formatIfNumber } from '@datashaper/tables'
import upperFirst from 'lodash-es/upperFirst.js'
import { useMemo } from 'react'

import { EMPTY_OBJECT } from '../../../empty.js'
import { pretty } from './StatsColumnHeader.constants.js'

export function useTooltip(stats?: FieldMetadata): string {
	return useMemo(() => {
		const { bins, categories, ...nobins } = stats || EMPTY_OBJECT
		return Object.entries(nobins).reduce((acc, cur, idx) => {
			const [key, value] = cur
			const nice = upperFirst(pretty[key] || key)
			return `${acc}${idx > 0 ? '\n' : ''}${nice}: ${formatIfNumber(value)}`
		}, '')
	}, [stats])
}
