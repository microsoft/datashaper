/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useMemo } from 'react'

export function useColumnOptions(
	table: ColumnTable | undefined,
): IDropdownOption[] {
	return useMemo(
		() =>
			(table?.columnNames() || []).map((name) => ({
				key: name,
				text: name,
			})),
		[table],
	)
}
