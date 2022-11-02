/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import { memo } from 'react'

import type { StepComponentProps } from '../../../../types.js'
import { OneHotBase } from './OneHot.base.js'

export const OneHot: React.FC<StepComponentProps<OnehotArgs>> = memo(
	function OneHot({ step, onChange }) {
		return <OneHotBase step={step} onChange={onChange} />
	},
)
