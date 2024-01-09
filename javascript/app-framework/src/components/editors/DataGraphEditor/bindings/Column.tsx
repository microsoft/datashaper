/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'
import type {
	ColorBinding,
	DataFieldBinding,
	NumericFieldScaleBinding,
} from '@datashaper/workflow'

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useColumnOptions } from './Column.hooks.js'
import type { Observable } from 'rxjs'

export interface ColumnProps {
	binding: DataFieldBinding | NumericFieldScaleBinding | ColorBinding // TODO: these should inherit from the DataFieldBinding type
	table: ColumnTable | undefined
	label?: string
}

export const Column: React.FC<ColumnProps> = memo(function Column({
	binding,
	table,
	label = 'Column',
}) {
	const field = useObservableState(binding.field$, binding.field)
	const columnsOptions = useColumnOptions(table)
	return (
		<Dropdown
			label={label}
			options={columnsOptions}
			onChange={(_, option) => {
				binding.field = option?.key as string
			}}
			selectedKey={field}
		/>
	)
})

// TODO: this is pretty quick and dirty
export interface ObservableColumnBindingProps {
	observable: Observable<string | undefined>
	initial: string | undefined
	table: ColumnTable | undefined
	onChange: (value: string) => void
	label?: string
}

export const ObservableColumnBinding: React.FC<ObservableColumnBindingProps> =
	memo(function Column({
		observable,
		initial,
		table,
		onChange,
		label = 'Column',
	}) {
		const field = useObservableState(observable, initial)
		const columnsOptions = useColumnOptions(table)
		return (
			<Dropdown
				label={label}
				options={columnsOptions}
				onChange={(_, option) => onChange(option?.key as string)}
				selectedKey={field}
			/>
		)
	})
