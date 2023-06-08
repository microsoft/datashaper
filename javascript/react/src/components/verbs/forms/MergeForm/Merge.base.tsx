/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@datashaper/schema'
import { MergeStrategy } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import {
	type FormInput,
	enumDropdown,
	FormInputType,
	VerbForm,
} from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const MergeFormBase: React.FC<StepFormBaseProps<MergeArgs>> = memo(
	function MergeFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<MergeArgs>[]>(
			() => [
				enumDropdown(
					'Merge strategy',
					MergeStrategy,
					step.args.strategy,
					(s, val) => {
						s.args.strategy = val as MergeStrategy
					},
					{ required: true, placeholder: 'Choose strategy' },
				),
				{
					label: 'Delimiter',
					type: FormInputType.Text,
					if: step.args.strategy === MergeStrategy.Concat,
					current: step.args.delimiter,
					onChange: (s, val) => {
						s.args.delimiter = val as string
					},
				},
				{
					label: 'Keep source columns',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => {
						s.args.preserveSource = val as boolean
					},
					advanced: true,
				},
				{
					label: 'Unhot',
					type: FormInputType.Checkbox,
					current: step.args.unhot,
					onChange: (s, val) => {
						s.args.unhot = val as boolean
					},
					advanced: true,
				},
				{
					label: 'Prefix',
					type: FormInputType.Text,
					if: step.args.unhot === true,
					current: step.args.prefix,
					onChange: (s, val) => {
						s.args.prefix = val as string
					},
					advanced: true,
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
