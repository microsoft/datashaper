/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { useSimpleDropdownOptions } from '../../hooks/index.js'
import type { StepComponentBaseProps } from '../../types.js'
import type { FormInput } from '../../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../../verbForm/VerbForm.js'
import { enumDropdown } from '../../verbForm/VerbFormFactories.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PivotBase: React.FC<
	StepComponentBaseProps<PivotArgs> & { columns: string[] }
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
				onChange: (s, val) => (s.args.key = val as string),
			},
			{
				label: 'Column used as value',
				placeholder: 'Choose column',
				required: true,
				type: FormInputType.SingleChoice,
				current: step.args.value,
				options,
				onChange: (s, val) => (s.args.value = val as string),
			},
			enumDropdown(
				'Function',
				FieldAggregateOperation,
				step.args.operation,
				(s, val) => (s.args.operation = val as FieldAggregateOperation),
			),
		],
		[step, options],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
