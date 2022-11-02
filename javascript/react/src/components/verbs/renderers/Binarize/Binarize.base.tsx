/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Filter } from '../Filter/index.js'
import type { StepComponentProps } from '../types.js'

/**
 * Provides inputs for a Binarize step.
 */
export const BinarizeBase: React.FC<StepComponentProps> = memo(
	function Binarize(props) {
		return <Filter {...(props as any)} />
	},
)
