/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { memo } from 'react'

import { Filter } from '../Filter/Filter.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Binarize: React.FC<StepComponentProps> = memo(function Binarize(
	props,
) {
	return <Filter {...(props as any)} />
})
