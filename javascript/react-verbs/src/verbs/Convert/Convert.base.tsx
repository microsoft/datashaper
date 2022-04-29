/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { ParseType } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/primitives'
import { useMemo, memo } from 'react'
import type { IDropdownOption } from '@fluentui/react'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import type { StepComponentBaseProps } from '../../types.js'
import type { FormInput } from '../../common/VerbForm.js'
import { toggleListItem } from '@data-wrangling-components/primitives'
import {
	getEnumDropdownOptions,
	getDateFormatPatternOptions,
} from '@data-wrangling-components/react-controls'

/**
 * Provides inputs for a Convert step.
 */
export const ConvertBase: React.FC<
	StepComponentBaseProps<ConvertArgs> & {
		columns: IDropdownOption[]
	}
> = memo(function ConvertBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<ConvertArgs>[]>(
		() => [
			{
				label: 'Columns to convert',
				type: FormInputType.MultiChoice,
				options: columns,
				current: step.args.columns,
				condition: columns.length > 0,
				onChange: (s, opt) =>
					(s.args.columns = toggleListItem(s.args.columns, opt as string)),
			},
			{
				label: 'Data type',
				type: FormInputType.SingleChoice,
				current: step.args.type,
				options: getEnumDropdownOptions(ParseType),
				onChange: (s, opt) => (s.args.type = opt as ParseType),
			},
			{
				label: 'Base (radix)',
				condition: step.args.type === ParseType.Integer,
				type: FormInputType.Text,
				current: step.args.radix ? `${step.args.radix}` : '',
				onChange: (s, opt) => (s.args.radix = num(opt as string)),
			},
			{
				label: 'Date format pattern',
				condition: step.args.type === ParseType.Date,
				type: FormInputType.ComboBox,
				options: getDateFormatPatternOptions(),
				placeholder: 'pattern',
				current: step.args.formatPattern
					? `${step.args.formatPattern}`
					: undefined,
				onChange: (s, opt, value) =>
					(s.args.formatPattern = opt ? (opt as string) : value),
				onInputValueChange: (s, value) =>
					(s.args.formatPattern = value ? value : '%Y-%m-%d'),
			},
		],
		[step, columns],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
