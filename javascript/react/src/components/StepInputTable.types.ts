/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager,Step } from '@data-wrangling-components/core'

import type { StepComponentProps } from '../types.js'

export interface StepInputTableProps {
	label?: string
	step: Step
	graph: GraphManager
	onChange: StepComponentProps['onChange']
}
