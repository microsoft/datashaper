/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortDirection } from '@datashaper/arquero'
import type { IGroup } from '@fluentui/react'
import type { GroupBySpec, RowObject } from 'arquero/dist/types/table/table'

export function groupBuilder(
	row: RowObject,
	existingGroups: GroupBySpec,
	actualLevel: number,
	totalLevelCount: number,
	items: RowObject[],
	sortDirection?: SortDirection,
	lazyLoadGroups = true,
	sortColumn?: string,
	fatherIndex = 0,
): IGroup {
	const value = row[0]
	const valueGroups = row[1]
	const columnName = existingGroups.names[actualLevel]

	if (!columnName) {
		throw new Error(`could not determine column name for level ${actualLevel}`)
	}

	const startIndex =
		items
			.slice(fatherIndex)
			.findIndex((item: any) => item[columnName] === value) + fatherIndex

	const group = {
		key: value.toString(),
		name: value.toString(),
		startIndex: startIndex,
		level: actualLevel,
		count: valueGroups.length,
		isCollapsed: lazyLoadGroups ? actualLevel !== 0 && startIndex !== 0 : false,
	} as IGroup

	const nextLevel = actualLevel + 1
	if (nextLevel < totalLevelCount) {
		const children = sortValueGroupsItems(
			valueGroups,
			existingGroups,
			nextLevel,
			sortDirection,
			sortColumn,
		).map((valueGroup: any) => {
			return groupBuilder(
				valueGroup,
				existingGroups,
				nextLevel,
				totalLevelCount,
				items,
				sortDirection,
				lazyLoadGroups,
				sortColumn,
				startIndex,
			)
		})
		group.children = children
	}
	return group
}

function sortValueGroupsItems(
	entries: RowObject[],
	existingGroups: any,
	nextLevel: number,
	sortDirection?: SortDirection,
	sortColumn?: string | undefined,
): RowObject[] {
	const columnName = existingGroups.names[nextLevel]
	if (sortColumn && sortColumn !== columnName) return entries
	return sortDirection === SortDirection.Ascending
		? entries.sort((a, b) => a[0] - b[0])
		: entries.sort((a, b) => b[0] - a[0])
}
