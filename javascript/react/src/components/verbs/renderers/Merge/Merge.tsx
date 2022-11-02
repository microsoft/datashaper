/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../../../../types.js'
import { MergeBase } from './Merge.base.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Merge: React.FC<StepComponentProps<MergeArgs>> = memo(
	function Merge({ step, onChange }) {
		return <MergeBase step={step} onChange={onChange} />
	},
)
