/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { op } from 'arquero'
import { memo, useEffect } from 'react'

import { useStepDataTable } from '../../hooks/index.js'
import type { StepComponentProps } from '../../types'
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

	useEffect(() => {
		if (dataTable != null && onChange != null) {
			if (step.args.min == null && step.args.max == null) {
				const rollup = dataTable.rollup({
					min: op.min(step.args.column),
					max: op.max(step.args.column),
				})

				onChange({
					...step,
					args: {
						...step.args,
						min: rollup.get('min', 0),
						max: rollup.get('max', 0),
					},
				})
			}
		}
	}, [dataTable, onChange, step])

	return <BinBase step={step} onChange={onChange} />
})
