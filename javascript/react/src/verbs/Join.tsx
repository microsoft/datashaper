/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/core'
import { NodeInput } from '@datashaper/dataflow'
import { memo } from 'react'

import {
	useDataTable,
	useTableColumnNames,
	useTableNames,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { JoinBase } from './Join.base.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps<JoinArgs>> = memo(function Join({
	step,
	graph,
	input,
	onChange,
}) {
	const tableNames = useTableNames(graph)
	const leftTable = useDataTable(
		input || step.input[NodeInput.Source]?.node,
		graph,
	)
	const rightTable = useDataTable(step.input[NodeInput.Other]?.node, graph)
	const leftColumns = useTableColumnNames(leftTable)
	const rightColumns = useTableColumnNames(rightTable)

	return (
		<JoinBase
			step={step}
			onChange={onChange}
			tables={tableNames}
			leftColumns={leftColumns}
			rightColumns={rightColumns}
		/>
	)
})
