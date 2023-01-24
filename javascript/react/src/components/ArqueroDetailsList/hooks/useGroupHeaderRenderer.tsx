/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type {
	IDetailsGroupDividerProps,
	IRenderFunction,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import { GroupHeader } from '../GroupHeader.js'
import type { GroupHeaderFunction } from '../index.js'

/**
 * Overrides the default group header rendering so we can inject customization
 * @returns
 */
export function useGroupHeaderRenderer(
	table: ColumnTable,
	fields: Field[],
	groupHeaderFunction?: GroupHeaderFunction,
	lazyLoadGroups = true,
): IRenderFunction<IDetailsGroupDividerProps> {
	return useCallback(
		(props?, defaultRender?) => {
			if (!(props && defaultRender)) {
				return null
			}

			const columnName = table.groups().names[props.groupLevel as number]
			const field = columnName
				? fields.find((f) => f.name === columnName)
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

			return groupHeaderFunction(field, columnName, props)
		},
		[groupHeaderFunction, table, fields, lazyLoadGroups],
	)
}
