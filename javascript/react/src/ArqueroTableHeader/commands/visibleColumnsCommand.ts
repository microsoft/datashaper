/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarItemProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import merge from 'lodash-es/merge.js'

import { checkedItemsCommand } from './checkedItemsCommand.js'

/**
 * Constructs a visible columns command.
 * This is a dropdown button that lists all of the
 * columns in a table, with checks next to the visible ones.
 * @param table
 * @param columns
 * @param onCheckChange
 * @returns
 */
export function visibleColumnsCommand(
	table: ColumnTable,
	columns?: string[],
	onCheckChange?: (column: string, checked: boolean) => void,
	props?: Partial<ICommandBarItemProps>,
): ICommandBarItemProps {
	return checkedItemsCommand(
		table.columnNames(),
		columns,
		onCheckChange,
		merge(
			{},
			{
				key: 'visible-columns',
				title: 'Select visible columns',
				iconProps: {
					iconName: 'ColumnVerticalSection',
				},
			},
			props,
		),
	)
}
