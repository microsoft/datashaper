/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AggregateArgs} from '@data-wrangling-components/core';
import {
	FieldAggregateOperation
} from '@data-wrangling-components/core'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-controls'
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'

import type { FormInput} from '../../common/VerbForm.js';
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import type { StepComponentBaseProps } from '../../types.js'

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

	return <VerbForm step={step} inputs={verbInputs} onChange={onChange} />
}
