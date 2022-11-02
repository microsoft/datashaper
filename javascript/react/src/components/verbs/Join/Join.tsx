/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo } from 'react'

import { useDataTable, useTableColumnNames } from '../../../hooks/index.js'
import { useTableDropdownOptions } from '../../../hooks/useTableDropdownOptions.js'
import type { StepComponentProps } from '../../../types.js'
import { JoinBase } from './Join.base.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps<JoinArgs>> = memo(function Join({
	step,
	workflow,
	input,
	onChange,
}) {
	const tableOptions = useTableDropdownOptions(workflow)

	const leftTable = useDataTable(
		input || step.input[NodeInput.Source]?.node,
		workflow,
	)
	const rightTable = useDataTable(step.input[NodeInput.Other]?.node, workflow)
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
