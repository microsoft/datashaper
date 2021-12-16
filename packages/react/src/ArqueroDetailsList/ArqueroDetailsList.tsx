/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	SelectionMode,
	IDetailsListProps,
} from '@fluentui/react'
import type { internal as ArqueroTypes } from 'arquero'
import React, { memo, useMemo } from 'react'
import { useSlice } from './hooks'
import { useColumnDefaults } from './hooks/useColumnDefaults'

export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ArqueroTypes.ColumnTable
	offset?: number
	limit?: number
}

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList(props) {
		const {
			table,
			limit = Infinity,
			offset = 0,
			compact = true,
			selectionMode = SelectionMode.none,
			layoutMode = DetailsListLayoutMode.fixedColumns,
			columns,
			...rest
		} = props

		const slice = useSlice(table, offset, limit)

		const items = useMemo(() => slice.objects(), [slice])

		const columnDefaults = useColumnDefaults(table, columns)

		return (
			<DetailsList
				items={items}
				compact={compact}
				selectionMode={selectionMode}
				layoutMode={layoutMode}
				columns={columnDefaults as IColumn[]}
				{...rest}
			/>
		)
	},
)
