/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Provides inputs for a Spread step.
 */
export const SpreadFormBase: React.FC<StepFormBaseProps<SpreadArgs>> = memo(
	function SpreadFormBase({ step, onChange }) {
		const inputs = useMemo<FormInput<SpreadArgs>[]>(
			() => [
				{
					label: 'Output columns',
					placeholder: 'Comma-delimited list of names',
					type: FormInputType.Text,
					required: false,
					current: step.args.to ? step.args.to.join(',') : '',
					onChange: (s, val) => {
						s.args.to = (val as string)?.split(',').map((v) => v.trim())
					},
					advanced: true,
				},
				{
					label: 'Keep source column',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => {
						s.args.preserveSource = val as boolean
					},
					advanced: true,
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
