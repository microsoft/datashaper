/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICheckboxProps, IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useMemo, useState } from 'react'

export function useCheckboxConfigs(table: ColumnTable | undefined): {
	checkboxes: ICheckboxProps[]
} {
	const [checked, setChecked] = useState<string[]>(table?.columnNames() || [])
	const checkboxes = useMemo(() => {
		return (
			table?.columnNames().map(column => ({
				label: column,
				checked: checked?.includes(column),
				onChange: (
					_ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
					chkd?: boolean,
				) => {
					setChecked(prev =>
						chkd ? [...prev, column] : prev.filter(c => c !== column),
					)
				},
			})) || []
		)
	}, [table, checked, setChecked])

	return { checkboxes }
}

export function useColumns(checkboxes: ICheckboxProps[]): {
	columns: IColumn[]
} {
	const columns = useMemo(() => {
		return checkboxes
			.filter(c => c.checked)
			.map(({ label }) => ({
				key: label!,
				name: label!,
				fieldName: label!,
				minWidth: 120,
			}))
	}, [checkboxes])

	return {
		columns,
	}
}
