/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@data-wrangling-components/core'
import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react'
import upperFirst from 'lodash-es/upperFirst'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GroupedContextualMenuItems } from './StepSelector.types.js'

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
		],
	},
	{
		label: 'Derive columns',
		verbs: [
			'bin',
			'binarize',
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
		verbs: ['filter', 'rename', 'sample', 'select'],
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
 * Create a set of menu items with an assigned group for each
 * @returns
 */
export function useMenuItems(): IContextualMenuItem[] {
	return useMemo(() => {
		const filtered = Object.entries(Verb).filter(([, key]) => findGroup(key))
		return filtered.map(([text, key]) => ({
			key,
			text,
			data: findGroup(key),
			itemProps: {
				styles: {
					root: {
						paddingLeft: 8,
						height: 28,
						lineHeight: 28,
					},
					item: {
						listStyleType: 'none',
					},
				},
			},
		}))
	}, [])
}

function findGroup(verb: string) {
	return groups.find(group => group.verbs.findIndex(v => v === verb) >= 0)
		?.label
}

export function sortIntoGroups(
	items: IContextualMenuItem[],
): GroupedContextualMenuItems {
	return groups.reduce((acc, cur) => {
		const list = items.filter(item => item.data === cur.label)
		acc[cur.label] = list
		return acc
	}, {} as GroupedContextualMenuItems)
}

/**
 * Business logic to manage a list of items, a filtered copy, and a search chandler
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

/**
 * Creates a controlled component by accepting a verb from outside, but also tracking internally with an effect
 * @param verb
 * @param onChange - handler for verb changes via dropdown or dropdown + click
 * @ requireClick - indicates that the button click handler must be invoked for onChange to fure
 * @returns
 */
export function useSelectedOption(
	verb: Verb | undefined,
	onChange?: (verb: Verb) => void,
	requireButtonClick?: boolean,
): {
	selected: Verb | undefined
	onButtonClick: () => void
	onItemClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void
} {
	const [selected, setCurrentOption] = useState<Verb | undefined>()

	useEffect(() => {
		verb && setCurrentOption(verb)
	}, [verb])

	const onButtonClick = useCallback(() => {
		selected && onChange && onChange(selected)
	}, [selected, onChange])

	const onItemClick = useCallback(
		(_e, opt) => {
			setCurrentOption(opt.key)
			!requireButtonClick && onChange && onChange(opt.key)
		},
		[requireButtonClick, onChange, setCurrentOption],
	)

	return {
		selected,
		onButtonClick,
		onItemClick,
	}
}

export function useMenuProps(
	props: IContextualMenuProps,
): IContextualMenuProps {
	return useMemo(
		() => ({
			shouldFocusOnMount: true,
			...props,
		}),
		[props],
	)
}
