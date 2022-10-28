/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { CSSProperties } from 'react'

export interface StepHeaderStyles {
	root?: CSSProperties
	index?: CSSProperties
	verb?: CSSProperties
	details?: CSSProperties
}

export interface StepHeaderProps {
	step: Step
	index: number
	styles?: StepHeaderStyles
}
