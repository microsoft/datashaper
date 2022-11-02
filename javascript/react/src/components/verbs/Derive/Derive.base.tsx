/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@datashaper/schema'
import { MathOperator } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { useSimpleDropdownOptions } from '../../../hooks/index.js'
import type { StepComponentBaseProps } from '../../../types.js'
import {
	type FormInput,
	enumDropdown,
	FormInputType,
	VerbForm,
} from '../verbForm/index.js'

/**
 * Provides inputs for a Binarize step.
 */
export const DeriveBase: React.FC<
	StepComponentBaseProps<DeriveArgs> & { columns: string[] }
> = memo(function DeriveBase({ step, onChange, columns }) {
	const options = useSimpleDropdownOptions(columns)
	const inputs = useMemo<FormInput<DeriveArgs>[]>(
		() => [
			{
				label: 'Column one',
				placeholder: 'Choose column',
				type: FormInputType.SingleChoice,
				current: step.args.column1,
				required: true,
				options,
				onChange: (s, arg) => (s.args.column1 = arg as string),
			},
			enumDropdown(
				'Operation',
				MathOperator,
				step.args.operator,
				(s, arg) => (s.args.operator = arg as MathOperator),
				{ required: true, placeholder: 'Choose operation' },
			),
			{
				label: 'Column two',
				placeholder: 'Choose column',
				type: FormInputType.SingleChoice,
				options,
				current: step.args.column2,
				required: true,
				onChange: (s, arg) => (s.args.column2 = arg as string),
			},
		],
		[step, options],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
