/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../types.js'
import { EraseBase } from './Erase.base.js'

/**
 * Just the to/value inputs for an erase.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Erase: React.FC<StepComponentProps<EraseArgs>> = memo(
	function Erase({ step, onChange }) {
		return <EraseBase step={step} onChange={onChange} />
	},
)
