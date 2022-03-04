/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenuItemType, IContextualMenuItem } from '@fluentui/react'
import { useCallback } from 'react'

export function useSearch(
	items: IContextualMenuItem[],
	onSearch: (results: IContextualMenuItem[]) => void,
): {
	onClear: () => void
	onEscape: () => void
	onChange: (
		_ev?: React.ChangeEvent<HTMLInputElement>,
		newValue?: string,
	) => void
} {
	const onSearchAbort = useCallback(() => {
		onSearch(items)
	}, [items, onSearch])

	const onChange = useSearchChange(items, onSearch)

	return {
		onClear: onSearchAbort,
		onEscape: onSearchAbort,
		onChange,
	}
}

// performs as-you-type item filtering for a list of menu items, matching on the displayed text
// note that this supports section-type items by filtering the subitems
function useSearchChange(
	items: IContextualMenuItem[],
	onSearch: (results: IContextualMenuItem[]) => void,
) {
	return useCallback(
		(_ev?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
			const filtered: IContextualMenuItem[] = []
			items.forEach(item => {
				if (item.itemType === ContextualMenuItemType.Normal) {
					if (match(item, newValue)) {
						filtered.push(item)
					}
				} else if (item.itemType === ContextualMenuItemType.Section) {
					const subitems =
						item.sectionProps?.items.filter(subitem =>
							match(subitem, newValue),
						) || []
					filtered.push({
						...item,
						sectionProps: {
							...item.sectionProps,
							items: subitems,
						},
					})
				} else {
					// don't filter headers or dividers
					filtered.push(item)
				}
			})

			onSearch(filtered)
		},
		[items, onSearch],
	)
}

function match(item: IContextualMenuItem, find?: string): boolean {
	const text = item.text ? item.text.toLowerCase() : ''
	const lower = (find && find.toLowerCase()) || ''
	return text.indexOf(lower) !== -1
}
