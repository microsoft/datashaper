/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@data-wrangling-components/core'
import { memo } from 'react'

import type { StepComponentProps } from '../types.js'
import { SpreadBase } from './Spread.base.js'

export const Spread: React.FC<StepComponentProps<SpreadArgs>> = memo(
	function Spread({ step, onChange }) {
		return <SpreadBase step={step} onChange={onChange} />
	},
)
