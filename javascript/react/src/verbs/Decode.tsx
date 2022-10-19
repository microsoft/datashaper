/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DecodeArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../types.js'
import { DecodeBase } from './Decode.base.js'

/*
 *
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Decode: React.FC<StepComponentProps<DecodeArgs>> = memo(
	function Decode({ step, onChange }) {
		return <DecodeBase step={step} onChange={onChange} />
	},
)
