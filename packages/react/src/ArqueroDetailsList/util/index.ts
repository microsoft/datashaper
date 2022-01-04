/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { isArray, isNil, isString } from 'lodash'

export function getValue(item: any, column?: IColumn): any {
	return column?.fieldName && item[column.fieldName]
}

/**
 * Bins values into strict categories
 * @param values
 * @returns
 */
export function categories(values: any[]): Record<string, number> {
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
