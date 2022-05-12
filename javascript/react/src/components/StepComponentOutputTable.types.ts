/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StepComponentProps } from '../types.js'

export interface StepComponentOutputTableProps {
	label?: string
	disabled?: boolean
	step: StepComponentProps['step']
	output: StepComponentProps['output']
	onChange: StepComponentProps['onChange']
	onChangeOutput: StepComponentProps['onChangeOutput']
}
