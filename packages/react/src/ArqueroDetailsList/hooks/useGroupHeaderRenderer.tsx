/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@data-wrangling-components/core'
import type {
	IDetailsGroupDividerProps,
	IRenderFunction,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import type { GroupHeaderFunction } from '../index.js'
import { GroupHeader } from '../../controls/index.js'

/**
 * Overrides the default group header rendering so we can inject customization
 * @returns
 */
export function useGroupHeaderRenderer(
	table: ColumnTable,
	computedMetadata: TableMetadata,
	groupHeaderFunction?: GroupHeaderFunction,
	lazyLoadGroups = true,
): IRenderFunction<IDetailsGroupDividerProps> {
	return useCallback(
		(props?, defaultRender?) => {
			if (!props || !defaultRender) {
				return null
			}

			const columnName = table.groups().names[props.groupLevel as number]
			if (columnName == null) {
				return null
			}
			const meta = computedMetadata.columns[columnName]
			if (meta == null) {
				return null
			}
			if (!groupHeaderFunction) {
				return (
					<GroupHeader
						props={props}
						columnMeta={meta}
						lazyLoadGroups={lazyLoadGroups}
					/>
				)
			}

			return groupHeaderFunction(meta, props)
		},
		[groupHeaderFunction, computedMetadata, table, lazyLoadGroups],
	)
}
