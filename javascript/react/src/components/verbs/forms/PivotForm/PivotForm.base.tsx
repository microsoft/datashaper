/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { useSimpleDropdownOptions } from '../../../../hooks/index.js'
import {
	type FormInput,
	FormInputType,
	VerbForm,
	enumDropdown,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PivotFormBase: React.FC<
	StepFormBaseProps<PivotArgs> & { columns: string[] }
> = memo(function PivotBase({ step, onChange, columns }) {
	const options = useSimpleDropdownOptions(columns)

	const inputs = useMemo<FormInput<PivotArgs>[]>(
		() => [
			{
				label: 'Column used as key',
				placeholder: 'Choose column',
				required: true,
				type: FormInputType.SingleChoice,
				current: step.args.key,
				options,
				onChange: (s, val) => {
					s.args.key = val as string
				},
			},
			{
				label: 'Column used as value',
				placeholder: 'Choose column',
				required: true,
				type: FormInputType.SingleChoice,
				current: step.args.value,
				options,
				onChange: (s, val) => {
					s.args.value = val as string
				},
			},
			enumDropdown(
				'Function',
				FieldAggregateOperation,
				step.args.operation,
				(s, val) => {
					s.args.operation = val as FieldAggregateOperation
				},
			),
		],
		[step, options],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
