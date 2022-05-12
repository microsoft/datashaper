/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isInputTableStep } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

import { TableDropdown } from '../controls/index.js'
import {
	useDropdownChangeHandler,
	useSimpleDropdownOptions,
	useTableNames,
} from '../hooks/index.js'
import type { StepInputTableProps } from './StepInputTable.types.js'

export const StepInputTable: React.FC<StepInputTableProps> = memo(
	function StepInputTable({ label, step, graph, onChange }) {
		const tables = useTableNames(graph)
		const tableOptions = useSimpleDropdownOptions(tables)
		const handleTableChange = useDropdownChangeHandler(
			step,
			(s, val) => {
				if (val != null) {
					// determine the graph node id to subscribe from
					const tableName = val as string
					const outputNode = graph?.outputDefinitions.find(
						o => o.name === (tableName as string),
					)?.node

					// wire up the Step's input field
					const node = outputNode ?? tableName
					s.input[NodeInput.Source] = { node }
				} else {
					// no value: delete the input
					delete s.input[NodeInput.Source]
				}
			},
			onChange,
		)
		if (!isInputTableStep(step)) {
			return null
		}

		const selected = step.input[NodeInput.Source]?.node
		return (
			<TableDropdown
				options={tableOptions}
				label={label || 'Input table'}
				selectedKey={selected}
				onChange={handleTableChange}
			/>
		)
	},
)
