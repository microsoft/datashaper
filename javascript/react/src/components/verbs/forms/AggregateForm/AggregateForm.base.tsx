/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'
import { useMemo } from 'react'

import {
	type FormInput,
	dropdown,
	enumDropdown,
	VerbForm,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const AggregateFormBase: React.FC<
	StepFormBaseProps<AggregateArgs> & {
		columns: string[]
	}
> = function AggregateFormBase({ step, onChange, columns }) {
	const verbInputs = useMemo<FormInput<AggregateArgs>[]>(
		() => [
			dropdown(
				'Column to group by',
				columns,
				step.args.groupby,
				(s, key) => (s.args.groupby = key as string),
				{ required: true, placeholder: 'Choose column' },
			),
			enumDropdown(
				'Function',
				FieldAggregateOperation,
				step.args.operation,
				(s, key) => (s.args.operation = key as FieldAggregateOperation),
				{ required: true, placeholder: 'Choose function' },
			),
		],
		[step, columns],
	)

	return <VerbForm step={step} inputs={verbInputs} onChange={onChange} />
}
