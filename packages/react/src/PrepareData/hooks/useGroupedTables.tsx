/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile } from '@data-wrangling-components/utilities'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import { GroupedTable, TableGroup } from '../../../'

export function useGroupedTables(
	files: BaseFile[],
	outputs: Map<string, ColumnTable>,
): GroupedTable[] {
	return useMemo(() => {
		const fileNames = files.map(f => f.name)
		return Array.from(outputs).map(([key, table]) => {
			return {
				name: key,
				table: table,
				group: fileNames.includes(key)
					? TableGroup.Input
					: TableGroup.Intermediary,
			} as GroupedTable
		})
	}, [files, outputs])
}
