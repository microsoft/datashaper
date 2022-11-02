/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepDataTable } from '../../../../hooks/index.js'
import type { StepComponentProps } from '../../../../types.js'
import { DeriveBase } from './Derive.base.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps<DeriveArgs>> = memo(
	function Derive({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)
		return <DeriveBase columns={columns} step={step} onChange={onChange} />
	},
)
