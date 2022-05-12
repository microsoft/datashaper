/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'

import type { StepComponentProps } from '../types.js'

export interface StepComponentOutputColumnProps {
	label?: string
	step: Step
	onChange: StepComponentProps['onChange']
}
