/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FieldAggregateOperation,
	AggregateArgs,
} from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
import type { StepComponentBaseProps } from '../../types.js'
import { FormInput, FormInputType, VerbInput } from '../../common/VerbInput.js'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-controls'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const AggregateBase: React.FC<
	StepComponentBaseProps<AggregateArgs> & {
		columnOptions: IDropdownOption[]
	}
> = function AggregateBase({ step, onChange, columnOptions }) {
	const verbInputs = useMemo<FormInput<AggregateArgs>[]>(
		() => [
			{
				label: 'Column to group by',
				type: FormInputType.SingleChoice,
				options: columnOptions,
				current: step.args.groupby,
				onChange: (s, key) => (s.args.groupby = key as string),
				required: true,
			},
			{
				label: 'Function',
				type: FormInputType.SingleChoice,
				options: getEnumDropdownOptions(FieldAggregateOperation),
				current: step.args.operation,
				onChange: (s, key) =>
					(s.args.operation = key as FieldAggregateOperation),
				required: true,
			},
		],
		[step, columnOptions],
	)

	return <VerbInput step={step} inputs={verbInputs} onChange={onChange} />
}
