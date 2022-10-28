/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { getValue } from '../ArqueroDetailsList.utils.js'
import { usePrinted, useTooltip } from './ArrayCell.hooks.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'

/**
 * Basic rendering of array values.
 */
export const ArrayCell: React.FC<FormattedCellProps> = memo(function ArrayCell({
	item,
	column,
	textAlign = 'left',
}) {
	const values = getValue(item, column) || EMPTY_ARRAY
	const printed = usePrinted(values)
	const tooltip = useTooltip(values)
	const style = useTextAlignStyle(textAlign)
	return (
		<div title={tooltip} style={style}>
			{printed}
		</div>
	)
})
