/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { MergeStrategy } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../../../../types.js'
import {
	type FormInput,
	enumDropdown,
	FormInputType,
	VerbForm,
} from '../../verbForm/index.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const MergeBase: React.FC<StepComponentBaseProps<MergeArgs>> = memo(
	function MergeBase({ step, onChange }) {
		const inputs = useMemo<FormInput<MergeArgs>[]>(
			() => [
				enumDropdown(
					'Merge strategy',
					MergeStrategy,
					step.args.strategy,
					(s, val) => (s.args.strategy = val as MergeStrategy),
					{ required: true, placeholder: 'Choose strategy' },
				),
				{
					label: 'Delimiter',
					type: FormInputType.Text,
					if: step.args.strategy === MergeStrategy.Concat,
					current: step.args.delimiter,
					onChange: (s, val) => (s.args.delimiter = val as string),
				},
				{
					label: 'Keep source columns',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => (s.args.preserveSource = val as boolean),
					advanced: true,
				},
				{
					label: 'Unhot',
					type: FormInputType.Checkbox,
					current: step.args.unhot,
					onChange: (s, val) => (s.args.unhot = val as boolean),
					advanced: true,
				},
				{
					label: 'Prefix',
					type: FormInputType.Text,
					if: step.args.unhot === true,
					current: step.args.prefix,
					onChange: (s, val) => (s.args.prefix = val as string),
					advanced: true,
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
