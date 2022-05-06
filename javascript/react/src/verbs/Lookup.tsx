/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

import {
	useLoadTable,
	useTableColumnNames,
	useTableNames,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { LookupBase } from './Lookup.base.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps<LookupArgs>> = memo(
	function Lookup({ step, graph, table, onChange }) {
		const rightTable = useLoadTable(
			step.input[NodeInput.Other]?.node,
			undefined,
			graph,
		)
		const tables = useTableNames(graph)
		const leftColumns = useTableColumnNames(table)
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
