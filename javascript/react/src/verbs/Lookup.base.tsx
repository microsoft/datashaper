/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NodeInput } from '@datashaper/core'
import type { LookupArgs } from '@datashaper/schema'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import {
	inputColumnList,
	joinInputs,
	tableDropdown,
} from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Lookup step.
 */
export const LookupBase: React.FC<
	StepComponentBaseProps<LookupArgs> & {
		tableOptions: IDropdownOption[]
		leftColumns: string[]
		rightColumns: string[]
	}
> = memo(function LookupBase({
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
				step.input[NodeInput.Other]?.node,
				(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
				{ required: true, placeholder: 'Choose column' },
			),
			...joinInputs(step, leftColumns, rightColumns),
			inputColumnList(step, rightColumns, 'Columns to copy'),
		],
		[step, leftColumns, rightColumns, tableOptions],
	)

	return <VerbForm inputs={inputs} onChange={onChange} step={step} />
})
