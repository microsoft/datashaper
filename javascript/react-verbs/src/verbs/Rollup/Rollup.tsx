/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { VerbForm } from '../../common/VerbForm.js'
import { enumDropdown } from '../../common/VerbFormFactories.js'
import type { StepComponentProps } from '../../types.js'

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
