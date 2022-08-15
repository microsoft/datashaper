/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@datashaper/core'
import { FieldAggregateOperation } from '@datashaper/core'
import { memo, useMemo } from 'react'

import type { StepComponentProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import { enumDropdown } from '../verbForm/VerbFormFactories.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const RollupBase: React.FC<StepComponentProps<RollupArgs>> = memo(
	function RollupBase({ step, onChange }) {
		const inputs = useMemo<FormInput<RollupArgs>[]>(
			() => [
				enumDropdown(
					'Function',
					FieldAggregateOperation,
					step.args.operation,
					(s, val) => (s.args.operation = val as FieldAggregateOperation),
					{ required: true },
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
