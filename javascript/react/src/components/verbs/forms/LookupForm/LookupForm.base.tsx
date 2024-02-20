/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputBinding,
	LookupArgs,
	WorkflowStepId,
} from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useMemo } from 'react'

import {
	type FormInput,
	inputColumnList,
	joinInputs,
	tableDropdown,
	VerbForm,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'
import { getInputNode } from '../../../../util.js'
/**
 * Provides inputs for a Lookup step.
 */
export const LookupFormBase: React.FC<
	StepFormBaseProps<LookupArgs> & {
		tableOptions: IDropdownOption[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function LookupFormBase({
	step,
	onChange,
	tableOptions,
	leftColumns,
	rightColumns,
}) {
	const inputs = useMemo<FormInput<LookupArgs>[]>(
		() => [
			tableDropdown(
				'Join table',
				tableOptions,
				getInputNode(step, NodeInput.Other),
				(s, val) => {
					const binding: InputBinding = (s.input[NodeInput.Other] as InputBinding) ?? { }
					binding.step = val as WorkflowStepId
					step.input[NodeInput.Other] = binding
				},
				{ required: true, placeholder: 'Choose column' },
			),
			...joinInputs(step, leftColumns, rightColumns),
			inputColumnList(step, rightColumns, 'Columns to copy'),
		],
		[step, leftColumns, rightColumns, tableOptions],
	)

	return <VerbForm inputs={inputs} onChange={onChange} step={step} />
})
