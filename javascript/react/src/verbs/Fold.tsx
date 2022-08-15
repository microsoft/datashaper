/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@datashaper/core'
import { memo } from 'react'

import { useStepDataTable, useTableColumnNames } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { FoldBase } from './Fold.base.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Fold: React.FC<StepComponentProps<FoldArgs>> = memo(function Fold({
	step,
	graph,
	input,
	table,
	onChange,
}) {
	const dataTable = useStepDataTable(step, graph, input, table)
	const columns = useTableColumnNames(dataTable)
	return <FoldBase step={step} onChange={onChange} columns={columns} />
})
