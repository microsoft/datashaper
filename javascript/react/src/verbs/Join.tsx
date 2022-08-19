/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeInput } from '@datashaper/core'
import type { JoinArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useDataTable, useTableColumnNames } from '../hooks/index.js'
import { useTableDropdownOptions } from '../hooks/useTableDropdownOptions.js'
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
	const tableOptions = useTableDropdownOptions(graph)

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
			tableOptions={tableOptions}
			leftColumns={leftColumns}
			rightColumns={rightColumns}
		/>
	)
})
