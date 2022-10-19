/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useStepDataTable } from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { EncodeBase } from './Encode.base.js'

/*
 *
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Encode: React.FC<StepComponentProps<EncodeArgs>> = memo(
	function Encode({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		return <EncodeBase step={step} onChange={onChange} />
	},
)
