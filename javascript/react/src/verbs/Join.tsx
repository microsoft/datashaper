/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import {
	useLoadTable,
	useTableColumnNames,
	useTableNames,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'

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
	const leftTable = useLoadTable(
		input || step.input[NodeInput.Source]?.node,
		undefined,
		graph,
	)
	const rightTable = useLoadTable(
		step.input[NodeInput.Other]?.node,
		undefined,
		graph,
	)
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
