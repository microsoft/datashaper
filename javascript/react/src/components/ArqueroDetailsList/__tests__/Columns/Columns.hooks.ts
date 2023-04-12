/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICheckboxProps, IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useCallback, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../../empty.js'

export function useSelectedColumn(): {
	selected: string | undefined
	onSelect: (
		evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
		column?: IColumn | undefined,
	) => void
} {
	const [selected, setSelected] = useState<string | undefined>()
	const onSelect = useCallback(
		(
			_evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
			column?: IColumn | undefined,
		) => setSelected(column?.name),
		[setSelected],
	)
	return {
		selected,
		onSelect,
	}
}

export function useCheckboxConfigs(table: ColumnTable | undefined): {
	checkboxes: ICheckboxProps[]
} {
	const [checked, setChecked] = useState<string[]>(
		table?.columnNames() || EMPTY_ARRAY,
	)
	const checkboxes = useMemo(() => {
		return (
			table?.columnNames().map((column) => ({
				label: column,
				checked: checked?.includes(column),
				onChange: (
					_ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
					checked?: boolean,
				) => {
					setChecked((prev) =>
						checked ? [...prev, column] : prev.filter((c) => c !== column),
					)
				},
			})) || EMPTY_ARRAY
		)
	}, [table, checked, setChecked])

	return { checkboxes }
}

export function useColumns(checkboxes: ICheckboxProps[]): {
	columns: IColumn[]
} {
	const columns = useMemo(() => {
		return checkboxes
			.filter((c) => c.checked)
			.map(({ label }) => ({
				key: label,
				name: label,
				fieldName: label,
				minWidth: 100,
				// add some icons so we can confirm alignment in the headers
				iconName:
					label === 'Symbol'
						? 'FavoriteStarFill'
						: label === 'Date'
						? 'Calendar'
						: undefined,
			}))
	}, [checkboxes])

	return {
		columns,
	}
}
