/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { emptyObject } from '../../../empty.js'
import { getValue } from '../ArqueroDetailsList.utils.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic rendering of objects.
 */
export const ObjectCell: React.FC<FormattedCellProps> = memo(
	function ObjectCell({ item, column, textAlign = 'left' }) {
		const value = getValue(item, column) || emptyObject()
		const style = useTextAlignStyle(textAlign)
		return <div style={style}>{JSON.stringify(value)}</div>
	},
)
