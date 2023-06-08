/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@datashaper/schema'
import { FieldAggregateOperation } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, enumDropdown, VerbForm } from '../forms/index.js'
import type { StepFormProps } from '../types.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const RollupFormBase: React.FC<StepFormProps<RollupArgs>> = memo(
	function RollupFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<RollupArgs>[]>(
			() => [
				enumDropdown(
					'Function',
					FieldAggregateOperation,
					step.args.operation,
					(s, val) => {
						s.args.operation = val as FieldAggregateOperation
					},
					{ required: true },
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
