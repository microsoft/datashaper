/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepFormProps } from '../types.js'
import { OneHotFormBase } from './OneHotForm.base.js'

export const OneHotForm: React.FC<StepFormProps<OnehotArgs>> = memo(
	function OneHotForm({ step, onChange }) {
		return <OneHotFormBase step={step} onChange={onChange} />
	},
)
