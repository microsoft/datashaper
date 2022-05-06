/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@data-wrangling-components/core'
import type { StepComponentProps } from '../types'
import { memo } from 'react'

import { BinBase } from './Bin.base.js'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps<BinArgs>> = memo(function Bin({
	step,
	onChange,
}) {
	return <BinBase step={step} onChange={onChange} />
})
