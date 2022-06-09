/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { BaseButton, Button, IContextualMenuItem } from '@fluentui/react'
import { ContextualMenuItemType } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

/**
 * Returns props to render a grouped menu,
 * including the text to display (based on selected table),
 * the list of renderable items, and an onItemClick handler to update the selection
 * @param inputs
 * @param derived
 * @param selected
 * @param onSelect
 * @returns
 */
export function useTableSelection(
	inputs: TableContainer[],
	derived: TableContainer[],
	selected?: string,
	onSelect?: (id: string) => void,
): {
	text?: string
	items: IContextualMenuItem[]
	onItemClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void
} {
	const inputItems = useMenuItems(inputs)
	const derivedItems = useMenuItems(derived)

	const items = useMemo(
		() => [
			{
				key: '__input-tables__',
				itemType: ContextualMenuItemType.Section,
				sectionProps: {
					title: 'Inputs',
					items: inputItems.sort(),
				},
			},
			{
				key: '__derived-tables__',
				itemType: ContextualMenuItemType.Section,
				sectionProps: {
					title: 'Derived',
					items: derivedItems,
				},
			},
		],
		[inputItems, derivedItems],
	)

	const onItemClick = useCallback(
		(_e: any, opt: IContextualMenuItem | undefined) =>
			opt && onSelect?.(opt.key),
		[onSelect],
	)

	const text = useMemo(() => (selected ? selected : 'Choose table'), [selected])

	return {
		text,
		items,
		onItemClick,
	}
}

/**
 * Provides a button click handler to select the last derived table.
 * @param derived
 * @param onSelect
 * @returns
 */
export function useOutputPreview(
	derived: TableContainer[],
	onSelect?: (id: string) => void,
): {
	onClick:
		| React.MouseEventHandler<
				| HTMLDivElement
				| HTMLAnchorElement
				| HTMLButtonElement
				| BaseButton
				| Button
				| HTMLSpanElement
		  >
		| undefined
} {
	const lastId = useMemo(() => {
		if (derived && derived.length > 0) {
			return derived[derived.length - 1]!.id
		}
	}, [derived])

	const onClick = useCallback(() => {
		lastId && onSelect?.(lastId)
	}, [lastId, onSelect])

	return {
		onClick,
	}
}

function useMenuItems(tables: TableContainer[]): IContextualMenuItem[] {
	return useMemo(() => {
		return tables.map(table => ({
			key: table.id,
			text: table.id,
		}))
	}, [tables])
}
