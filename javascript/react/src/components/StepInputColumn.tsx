/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnArgs,Step } from '@data-wrangling-components/core'
import { isInputColumnStep } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

import { TableColumnDropdown } from '../controls/TableColumnDropdown.js'
import {
	useDataTable,
	useDropdownChangeHandler,
	useSimpleDropdownOptions,
	useTableColumnNames,
} from '../hooks/index.js'
import { useColumnFilter } from './StepInputColumn.hooks.js'
import type { StepInputColumnProps } from './StepInputColumn.types.js'

export const StepInputColumn: React.FC<StepInputColumnProps> = memo(
	function StepInputColumn({ label, step, graph, onChange }) {
		const handleColumnChange = useDropdownChangeHandler<InputColumnArgs>(
			step as Step<InputColumnArgs>,
			(s, val) => (s.args.column = val as string),
			onChange,
		)

		// TODO: detailed types/stats should be an option on table load,
		// which will then be passed around with the container and thereby cached
		// useDatatable should return a TableContainer
		const tbl = useDataTable(step.input[NodeInput.Source]?.node, graph)
		const filter = useColumnFilter(step, tbl)
		const columns = useTableColumnNames(tbl, filter)
		const options = useSimpleDropdownOptions(columns)

		if (!isInputColumnStep(step)) {
			return null
		}
		return (
			<TableColumnDropdown
				required
				options={options}
				label={label || `Column to ${step.verb}`}
				selectedKey={(step.args as InputColumnArgs).column}
				onChange={handleColumnChange}
			/>
		)
	},
)
