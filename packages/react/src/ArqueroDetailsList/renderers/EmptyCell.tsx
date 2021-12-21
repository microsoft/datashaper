/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IColumn } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'

export interface EmptyCellProps {
	item?: any
	index?: number
	column?: IColumn
}

/**
 * Standard rendering of Empty values.
 * TODO: if we know the data type of the column, left/right align the dash.
 */
export const EmptyCell: React.FC<EmptyCellProps> = memo(function EmptyCell() {
	const theme = useThematic()
	const style = useMemo(
		() => ({
			color: theme.application().lowContrast().hex(),
		}),
		[theme],
	)
	return <div style={style}>&mdash;</div>
})
