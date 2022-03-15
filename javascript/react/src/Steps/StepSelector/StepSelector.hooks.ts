/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@data-wrangling-components/core'
import type { IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst'
import { useCallback, useEffect, useMemo, useState } from 'react'

// TODO: use core Tags for this
const groups = [
	{
		label: 'Aggregates',
		verbs: [
			'aggregate',
			'groupby',
			'pivot',
			'orderby',
			'rollup',
			'ungroup',
			'unorder',
			'unroll',
			'window',
		],
	},
	{
		label: 'Derive columns',
		verbs: [
			'bin',
			'binarize',
			'convert',
			'derive',
			'erase',
			'fill',
			'fold',
			'impute',
			'merge',
			'recode',
			'spread',
			'unfold',
		],
	},
	{
		label: 'Filter & Select',
		verbs: ['fetch', 'filter', 'rename', 'sample', 'select'],
	},
	{
		label: 'Joins & Sets',
		verbs: [
			'concat',
			'dedupe',
			'difference',
			'intersect',
			'join',
			'lookup',
			'union',
		],
	},
]

/**
 * Create a set of menu items using the groups to sort into sections
 * @returns
 */
function useMenuItems(): IContextualMenuItem[] {
	return useMemo(
		() =>
			groups.map(group => ({
				key: `__section-${group.label}__`,
				itemType: ContextualMenuItemType.Section,
				sectionProps: {
					title: group.label,
					items: group.verbs.map(verb => {
						const found = Object.entries(Verb).find(v => v[1] === verb)!
						return {
							key: found[1],
							text: found[0],
						}
					}),
				},
			})),
		[],
	)
}

/**
 * Business logic to manage a list of items, a filtered copy, and a search handler
 */
export function useSearchableItems(): {
	items: IContextualMenuItem[]
	filtered: IContextualMenuItem[]
	onSearch: (results: IContextualMenuItem[]) => void
	onSearchReset: () => void
} {
	const items = useMenuItems()
	const [filtered, setFiltered] = useState(items)
	const onSearch = useCallback(filtered => setFiltered(filtered), [setFiltered])
	const onSearchReset = useCallback(() => setFiltered(items), [items])
	return {
		items,
		filtered,
		onSearch,
		onSearchReset,
	}
}

/**
 * Creates a controlled component by accepting a verb from outside, but also tracking internally with an effect
 * @param verb
 * @param onChange - handler for verb changes via dropdown or dropdown + click
 * @param requireClick - indicates that the button click handler must be invoked for onChange to fure
 * @returns
 */
export function useSelectedOption(
	verb: Verb | undefined,
	onChange?: (verb: Verb) => void,
	requireButtonClick?: boolean,
	placeholder?: string,
): {
	text?: string
	onButtonClick: () => void
	onItemClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void
} {
	const [selected, setSelected] = useState<Verb | undefined>(verb)

	useEffect(() => {
		verb && setSelected(verb)
	}, [verb])

	const onButtonClick = useCallback(() => {
		selected && onChange && onChange(selected)
	}, [selected, onChange])

	const onItemClick = useCallback(
		(_e, opt) => {
			setSelected(opt.key)
			!requireButtonClick && onChange && onChange(opt.key)
		},
		[requireButtonClick, onChange, setSelected],
	)

	const text = useDropdownButtonText(selected, placeholder)
	return {
		text,
		onButtonClick,
		onItemClick,
	}
}

/**
 * Displays either the selected option or the placeholder
 * @param selected
 * @param placeholder
 * @returns
 */
export function useDropdownButtonText(
	selected?: string,
	placeholder?: string,
): string | undefined {
	return useMemo(() => {
		return selected ? upperFirst(selected) : placeholder
	}, [selected, placeholder])
}
