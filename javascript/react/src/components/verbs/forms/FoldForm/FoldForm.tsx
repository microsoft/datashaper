/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { FoldFormBase } from './FoldForm.base.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const FoldForm: React.FC<StepFormProps<FoldArgs>> = memo(function Fold({
	step,
	onChange,
}) {
	return <FoldFormBase step={step} onChange={onChange} />
})
