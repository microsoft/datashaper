/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../types'
import { BinBase } from './Bin.base.js'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps<BinArgs>> = memo(function Bin({
	step,
	onChange,
}) {
	step.args.min = 0
	step.args.max = 100
	return <BinBase step={step} onChange={onChange} />
})
