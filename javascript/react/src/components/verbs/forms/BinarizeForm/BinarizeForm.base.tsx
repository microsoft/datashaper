/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { FilterForm } from '../FilterForm/index.js'
import type { StepFormProps } from '../types.js'

/**
 * Provides inputs for a Binarize step.
 */
export const BinarizeFormBase: React.FC<StepFormProps> = memo(
	function BinarizeFormBase(props) {
		return <FilterForm {...(props as any)} />
	},
)
