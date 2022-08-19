/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeInput } from '@datashaper/core'
import type { JoinArgs } from '@datashaper/schema'
import { JoinStrategy } from '@datashaper/schema'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import {
	enumDropdown,
	joinInputs,
	tableDropdown,
} from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Join step.
 */
export const JoinBase: React.FC<
	StepComponentBaseProps<JoinArgs> & {
		tableOptions: IDropdownOption[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function JoinBase({
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
				step.input[NodeInput.Other]?.node,
				(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
				{ required: true, placeholder: 'Choose table' },
			),
			enumDropdown(
				'Join strategy',
				JoinStrategy,
				step.args.strategy,
				(s, val) => (s.args.strategy = val as JoinStrategy),
				{ required: true, placeholder: 'Choose join', advanced: true },
			),
			...joinInputs(step, leftColumns, rightColumns),
		],
		[step, leftColumns, rightColumns, tableOptions],
	)

	return <VerbForm step={step} onChange={onChange} inputs={inputs} />
})
