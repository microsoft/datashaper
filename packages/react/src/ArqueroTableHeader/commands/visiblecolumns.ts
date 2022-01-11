/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

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
	columns: string[],
	onCheckChange?: (column: string, checked: boolean) => void,
): ICommandBarItemProps {
	const click = (name: string, checked: boolean) => {
		onCheckChange && onCheckChange(name, checked)
	}
	const hash = columns.reduce((acc, cur) => {
		acc[cur] = true
		return acc
	}, {} as Record<string, boolean>)
	const items = table.columnNames().map(column => ({
		key: column,
		text: column,
		canCheck: true,
		checked: hash[column],
		onClick: () => click(column, !hash[column]),
	}))
	return {
		key: 'visible-columns',
		iconProps: {
			iconName: 'ColumnVerticalSection',
		},
		subMenuProps: {
			items,
		},
	}
}
