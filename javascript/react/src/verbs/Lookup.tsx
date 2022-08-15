/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@datashaper/core'
import { NodeInput } from '@datashaper/dataflow'
import { memo } from 'react'

import {
	useDataTable,
	useTableColumnNames,
	useTableNames,
} from '../hooks/index.js'
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
		const tables = useTableNames(graph)
		const leftColumns = useTableColumnNames(leftTable)
		const rightColumns = useTableColumnNames(rightTable)
		return (
			<LookupBase
				step={step}
				onChange={onChange}
				tables={tables}
				leftColumns={leftColumns}
				rightColumns={rightColumns}
			/>
		)
	},
)
