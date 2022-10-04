/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable } from '../hooks/index.js'
import type { StepComponentProps } from '../types'
import { BinBase } from './Bin.base.js'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps<BinArgs>> = memo(function Bin({
	step,
	workflow,
	input,
	table,
	onChange,
}) {
	const dataTable = useStepDataTable(step, workflow, input, table)
	return <BinBase step={step} onChange={onChange} table={dataTable} />
})
