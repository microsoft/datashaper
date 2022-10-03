/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@datashaper/schema'
import type { IColumn, IDropdownOption, IGroup } from '@fluentui/react'
import type { GroupBySpec, RowObject } from 'arquero/dist/types/table/table'
import isArray from 'lodash-es/isArray.js'
import isEqual from 'lodash-es/isEqual.js'
import isNaN from 'lodash-es/isNaN.js'
import isNil from 'lodash-es/isNil.js'
import isString from 'lodash-es/isString.js'
import orderBy from 'lodash-es/orderBy.js'
import uniqWith from 'lodash-es/uniqWith.js'

export function getValue(item: any, column?: IColumn): any {
	return column?.fieldName && item[column.fieldName]
}

export function getDropdownValue(
	item: any,
	rowIndex: number,
	column?: IColumn,
): IDropdownOption[] {
	const itens = getValue(item, column)
	const uniqueValues = uniqWith(itens, isEqual)
	const orderedValues = orderBy(uniqueValues)
	return orderedValues.map((value: any, index: number) => {
		return {
			key: `${index}-${value}`,
			text: value,
			data: { rowIndex, column },
			title: value,
		}
	})
}

/**
 * Bins values into strict categories
 * @param values
 * @returns
 */
export function categories(values: any[]): Record<string, number> | undefined {
	if (!isArray(values)) {
		return undefined
	}
	return values.reduce((acc, cur) => {
		const existing = acc[cur] || 0
		acc[cur] = existing + 1
		return acc
	}, {} as Record<string, number>)
}

/**
 * Determine if every category value has only a single count
 * @param cats
 * @returns
 */
export function isDistinctCategories(cats: Record<string, number>): boolean {
	return Object.values(cats).every(value => value === 1)
}

export function isEmpty(value: any): boolean {
	if (isNil(value) || isNaN(value)) {
		return true
	}
	if ((isString(value) || isArray(value)) && value.length === 0) {
		return true
	}
	return false
}

/**
 * A blank cell is just whitespace
 * @param value
 * @returns
 */
export function isBlank(value: any): boolean {
	return value === ' '
}

export function debounceFn(fn: () => void, delay = 500): () => void {
	const timer = setTimeout(() => fn(), delay)
	return () => clearTimeout(timer)
}

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
