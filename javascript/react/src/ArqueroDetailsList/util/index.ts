/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn, IDropdownOption } from '@fluentui/react'
import isArray from 'lodash-es/isArray.js'
import isEqual from 'lodash-es/isEqual.js'
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
	if (isNil(value)) {
		return true
	}
	if ((isString(value) || isArray(value)) && value.length === 0) {
		return true
	}
	return false
}

export function debounceFn(fn: () => void, delay = 500): () => void {
	const timer = setTimeout(() => fn(), delay)
	return () => clearTimeout(timer)
}
