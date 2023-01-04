/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@datashaper/schema'
import { memo } from 'react'

import { useColumnNames, useStepInputTable } from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { DeriveFormBase } from './DeriveForm.base.js'

/**
 * Provides inputs for a Binarize step.
 */
export const DeriveForm: React.FC<StepFormProps<DeriveArgs>> = memo(
	function DeriveForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input, table)
		const columns = useColumnNames(dataTable)
		return <DeriveFormBase columns={columns} step={step} onChange={onChange} />
	},
)
