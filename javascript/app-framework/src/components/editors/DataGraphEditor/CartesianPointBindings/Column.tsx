/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'
import type {
	DataFieldBinding,
	NumericFieldScaleBinding,
} from '@datashaper/workflow'

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useColumnOptions } from './Column.hooks.js'

export interface ColumnProps {
	binding: DataFieldBinding | NumericFieldScaleBinding
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
