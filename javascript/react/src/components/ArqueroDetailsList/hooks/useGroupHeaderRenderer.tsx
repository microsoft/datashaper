/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@datashaper/tables'
import type {
	IDetailsGroupDividerProps,
	IRenderFunction,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import { GroupHeader } from '../../GroupHeader/index.js'
import type { GroupHeaderFunction } from '../index.js'

/**
 * Overrides the default group header rendering so we can inject customization
 * @returns
 */
export function useGroupHeaderRenderer(
	table: ColumnTable,
	computedMetadata?: TableMetadata,
	groupHeaderFunction?: GroupHeaderFunction,
	lazyLoadGroups = true,
): IRenderFunction<IDetailsGroupDividerProps> {
	return useCallback(
		(props?, defaultRender?) => {
			if (!props || !defaultRender) {
				return null
			}

			const columnName = table.groups().names[props.groupLevel as number]
			const meta = columnName
				? computedMetadata?.columns[columnName]
				: undefined

			if (!groupHeaderFunction) {
				return (
					<GroupHeader
						props={props}
						columnName={columnName}
						lazyLoadGroups={lazyLoadGroups}
					/>
				)
			}

			return groupHeaderFunction(meta, columnName, props)
		},
		[groupHeaderFunction, table, lazyLoadGroups, computedMetadata?.columns],
	)
}
