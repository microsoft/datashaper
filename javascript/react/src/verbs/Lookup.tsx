/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeInput } from '@datashaper/core'
import type { LookupArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useDataTable, useTableColumnNames } from '../hooks/index.js'
import { useTableDropdownOptions } from '../hooks/useTableDropdownOptions.js'
import type { StepComponentProps } from '../types.js'
import { LookupBase } from './Lookup.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps<LookupArgs>> = memo(
	function Lookup({ step, graph, onChange }) {
		const leftTable = useDataTable(step.input[NodeInput.Source]?.node, graph)
		const rightTable = useDataTable(
			step.input[NodeInput.Other]?.node,

			graph,
		)
		const tableOptions = useTableDropdownOptions(graph)
		const leftColumns = useTableColumnNames(leftTable)
		const rightColumns = useTableColumnNames(rightTable)
		return (
			<LookupBase
				step={step}
				onChange={onChange}
				tableOptions={tableOptions}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)
