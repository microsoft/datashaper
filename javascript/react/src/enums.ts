import type { IDropdownOption } from '@fluentui/react'

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
