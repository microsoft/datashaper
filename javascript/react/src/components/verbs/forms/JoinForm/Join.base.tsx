/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputBinding, JoinArgs, WorkflowStepId } from '@datashaper/schema'
import { JoinStrategy } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useMemo } from 'react'

import {
	type FormInput,
	enumDropdown,
	joinInputs,
	tableDropdown,
	VerbForm,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'
import { getInputNode } from '../../../../util.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinFormBase: React.FC<
	StepFormBaseProps<JoinArgs> & {
		tableOptions: IDropdownOption[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function JoinFormBase({
	step,
	onChange,
	tableOptions,
	leftColumns,
	rightColumns,
}) {
	const inputs = useMemo<FormInput<JoinArgs>[]>(
		() => [
			tableDropdown(
				'Join table',
				tableOptions,
				getInputNode(step, NodeInput.Other),
				(s, val) => {
					const binding: InputBinding = (s.input[
						NodeInput.Other
					] as InputBinding) ?? { }
					binding.node = val as WorkflowStepId
					step.input[NodeInput.Other] = binding
				},
				{ required: true, placeholder: 'Choose table' },
			),
			enumDropdown(
				'Join strategy',
				JoinStrategy,
				step.args.strategy,
				(s, val) => {
					s.args.strategy = val as JoinStrategy
				},
				{ required: true, placeholder: 'Choose join', advanced: true },
			),
			...joinInputs(step, leftColumns, rightColumns),
		],
		[step, leftColumns, rightColumns, tableOptions],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})
