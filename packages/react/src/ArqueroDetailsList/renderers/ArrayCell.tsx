/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { getValue } from '../util/index.js'
import { FormattedCellProps } from './types.js'

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
	const printed = values.slice(0, CELL_LENGTH).join(', ')
	return (
		<div
			title={tooltip(values, TOOLTIP_LENGTH)}
			style={{
				textAlign,
			}}
		>
			{printed}
		</div>
	)
})

function tooltip(values: any[], length: number) {
	let tooltip = values.slice(0, length).join('\n')
	if (values.length > length) {
		tooltip += `\n...\n(+${values.length - length} more)`
	}
	return tooltip
}
