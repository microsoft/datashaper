/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'

/**
 * Make a basic set of string options from an array
 * @param list -
 * @returns
 */
export function useSimpleDropdownOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name.toString(),
			})),
		[list],
	)
}

export function useEnumDropdownOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	return useMemo(
		() => getEnumDropdownOptions(enumeration, labels),
		[enumeration, labels],
	)
}

export function getEnumDropdownOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	const options = Object.entries(enumeration).map(entry => {
		const [name, key] = entry
		const text = (labels && labels[key]) || formatEnumName(name)
		return {
			key,
			text,
		}
	})
	return options
}

/**
 * Formats a TitleCase enum name into a friendly-readable string
 * E.g. "TitleCase" => "Title case"
 * @param name
 * @returns
 */
function formatEnumName(name: string): string {
	const parts = name
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.split(/\s/)
	const first = parts[0]
	const rest = parts.slice(1).map(p => p.toLocaleLowerCase())
	return [first, ...rest].join(' ')
}

export function useDateFormatPatternOptions(): IDropdownOption[] {
	return useMemo(() => getDateFormatPatternOptions(), [])
}

export function getDateFormatPatternOptions(): IDropdownOption[] {
	const formatPatternArray: IDropdownOption[] = [
		{ key: '%Y-%m-%d', text: '%Y-%m-%d' },
		{ key: '%Y/%m/%d', text: '%Y/%m/%d' },
		{ key: '%B %d, %Y', text: '%B %d, %Y' },
		{ key: '%m-%d-%Y', text: '%m-%d-%Y' },
		{ key: '%m/%d/%Y', text: '%m/%d/%Y' },
		{ key: '%d-%m-%Y', text: '%d-%m-%Y' },
		{ key: '%d/%m/%Y', text: '%d/%m/%Y' },
		{ key: '%Y-%m-%dT%H:%M:%S.%LZ', text: 'ISO 8601 (%Y-%m-%dT%H:%M:%S.%LZ)' },
	]
	return formatPatternArray
}
