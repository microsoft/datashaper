/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import type { StepComponentProps } from '../types.js'
import { memo, useMemo } from 'react'

import type { FormInput } from '../verbForm/VerbForm.jsx'
import { VerbForm } from '../verbForm/VerbForm.jsx'
import { enumDropdown } from '../verbForm/VerbFormFactories.js'

/**
 * Just the column/op inputs for an rollup.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Rollup: React.FC<StepComponentProps<RollupArgs>> = memo(
	function Rollup({ step, onChange }) {
		const inputs = useMemo<FormInput<RollupArgs>[]>(
			() => [
				enumDropdown(
					'Function',
					FieldAggregateOperation,
					step.args.operation,
					(s, val) => (s.args.operation = val as FieldAggregateOperation),
				),
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
