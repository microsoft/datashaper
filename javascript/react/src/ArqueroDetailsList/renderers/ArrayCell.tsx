/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'

import { getValue } from '../util/index.js'
import type { FormattedCellProps } from './types.js'

const CELL_LENGTH = 5
const TOOLTIP_LENGTH = 20

/**
 * Basic rendering of array values.
 */
export const ArrayCell: React.FC<FormattedCellProps> = memo(function ArrayCell({
	item,
	column,
	textAlign = 'left',
}) {
	const values = getValue(item, column) || []
	const printed = usePrinted(values)
	const tooltip = useTooltip(values)
	return (
		<div
			title={tooltip}
			style={{
				textAlign,
			}}
		>
			{printed}
		</div>
	)
})

function usePrinted(values: unknown[], length = CELL_LENGTH) {
	return useMemo(() => {
		const arr = `[${values.slice(0, length).join(', ')}]`
		return values.length > length ? `${arr}...` : arr
	}, [values, length])
}

function useTooltip(values: unknown[], length = TOOLTIP_LENGTH) {
	return useMemo(() => {
		let tooltip = values.slice(0, length).join('\n')
		if (values.length > length) {
			tooltip += `\n...\n(+${values.length - length} more)`
		}
		return tooltip
	}, [values, length])
}
