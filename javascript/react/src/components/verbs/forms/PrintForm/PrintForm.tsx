/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PrintArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { PrintFormBase } from './PrintForm.base.js'

/**
 * Just the message input for a print.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PrintForm: React.FC<StepFormProps<PrintArgs>> = memo(
	function PrintForm({ step, onChange }) {
		return <PrintFormBase step={step} onChange={onChange} />
	},
)
