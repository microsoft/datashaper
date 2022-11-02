/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs, Field } from '@datashaper/schema'
import { DataType, ParseType } from '@datashaper/schema'
import { num } from '@datashaper/utilities'
import { memo, useMemo } from 'react'

import { getEnumDropdownOptions } from '../../../../enums.js'
import { getDateFormatPatternOptions } from '../../../dateFormats.js'
import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepComponentBaseProps } from '../types.js'

/**
 * Provides inputs for a Convert step.
 */
export const ConvertBase: React.FC<
	StepComponentBaseProps<ConvertArgs> & {
		fields: Field[]
	}
> = memo(function ConvertBase({ step, onChange, fields }) {
	const inputs = useMemo<FormInput<ConvertArgs>[]>(
		() => [
			{
				label: 'Data type',
				placeholder: 'Choose type',
				required: true,
				type: FormInputType.SingleChoice,
				current: step.args.type,
				options: getEnumDropdownOptions(ParseType),
				onChange: (s, opt) => (s.args.type = opt as ParseType),
			},
			{
				label: 'Base (radix)',
				if: step.args.type === ParseType.Integer,
				type: FormInputType.Text,
				current: step.args.radix ? `${step.args.radix}` : '',
				onChange: (s, opt) => (s.args.radix = num(opt as string)),
			},
			{
				label: 'Delimiter',
				if:
					step.args.type === ParseType.Array ||
					isInputColumnArray(fields, step.args.column),
				type: FormInputType.Text,
				current: step.args.delimiter ? `${step.args.delimiter}` : '',
				onChange: (s, opt) => (s.args.delimiter = opt as string),
			},
			{
				label: 'Date format pattern',
				if: step.args.type === ParseType.Date,
				type: FormInputType.ComboBox,
				options: getDateFormatPatternOptions(),
				placeholder: 'pattern',
				allowFreeform: true,
				current: step.args.formatPattern
					? `${step.args.formatPattern}`
					: undefined,
				onChange: (s, opt, value) =>
					(s.args.formatPattern = opt ? (opt as string) : value),
				onInputValueChange: (s, value) =>
					(s.args.formatPattern = value ? value : '%Y-%m-%d'),
			},
		],
		[step, fields],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

function isInputColumnArray(fields: Field[], column: string) {
	const meta = fields.find(field => field.name === column)
	return meta?.type === DataType.Array
}
