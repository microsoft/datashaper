/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@datashaper/schema'
import { memo } from 'react'

import {
	useColumnsMetadata,
	useStepInputTable,
} from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import { ConvertFormBase } from './ConvertForm.base.js'

/**
 * Provides inputs for a Convert step.
 */
export const ConvertForm: React.FC<StepFormProps<ConvertArgs>> = memo(
	function ConvertForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input, table)
		// TODO: replace this with introspect
		const fields = useColumnsMetadata(dataTable)
		return <ConvertFormBase step={step} onChange={onChange} fields={fields} />
	},
)
