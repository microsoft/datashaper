/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { INavLink, INavProps } from '@fluentui/react'
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
): INavProps {
	const inputItems = useMenuItems(inputs, false)
	const derivedItems = useMenuItems(derived, true)
	const groups = useMemo(() => {
		return [
			{
				name: 'Input tables',
				links: inputItems,
			},
			{
				name: 'Derived tables',
				links: derivedItems,
			},
		]
	}, [inputItems, derivedItems])
	const onLinkClick = useCallback(
		(_ev?: React.MouseEvent<HTMLElement>, item?: INavLink) =>
			/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
			onSelect?.(item?.key!),
		[onSelect],
	)
	return {
		groups,
		onLinkClick,
	}
}

function useMenuItems(
	tables: TableContainer[],
	isDerived: boolean,
): INavLink[] {
	return useMemo(() => {
		return tables.map(table => ({
			key: table.id,
			name: table.id,
			url: ``,
			icon: isDerived ? 'TableComputed' : 'Table',
		}))
	}, [tables, isDerived])
}
