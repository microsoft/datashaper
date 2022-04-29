/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@data-wrangling-components/core'
import { MathOperator } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import type { IDropdownOption } from '@fluentui/react'
import type { StepComponentBaseProps } from '../../types.js'
import { VerbForm, FormInput, FormInputType } from '../../common/VerbForm.jsx'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-controls'

/**
 * Provides inputs for a Binarize step.
 */
export const DeriveBase: React.FC<
	StepComponentBaseProps<DeriveArgs> & { options: IDropdownOption[] }
> = memo(function DeriveBase({ step, onChange, options }) {
	const inputs = useMemo<FormInput<DeriveArgs>[]>(
		() => [
			{
				label: 'Column one',
				type: FormInputType.SingleChoice,
				current: step.args.column1,
				required: true,
				options,
				onChange: (s, arg) => (s.args.column1 = arg as string),
			},
			{
				label: 'Operation',
				type: FormInputType.SingleChoice,
				current: step.args.operator,
				required: true,
				options: getEnumDropdownOptions(MathOperator),
				onChange: (s, arg) => (s.args.operator = arg as MathOperator),
			},
			{
				label: 'Column two',
				type: FormInputType.SingleChoice,
				options,
				current: step.args.column2,
				onChange: (s, arg) => (s.args.column2 = arg as string),
			},
		],
		[step],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
