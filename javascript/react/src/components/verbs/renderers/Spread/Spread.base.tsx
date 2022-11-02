/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../../../../types.js'
import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'

/**
 * Provides inputs for a Spread step.
 */
export const SpreadBase: React.FC<StepComponentBaseProps<SpreadArgs>> = memo(
	function SpreadBase({ step, onChange }) {
		const inputs = useMemo<FormInput<SpreadArgs>[]>(
			() => [
				{
					label: 'Keep source column',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => (s.args.preserveSource = val as boolean),
					advanced: true,
				},
				{
					label: 'Split delimiter',
					type: FormInputType.Text,
					current: step.args.delimiter,
					onChange: (s, val) => (s.args.delimiter = val as string),
					advanced: true,
				},
				{
					label: 'Onehot encode values',
					type: FormInputType.Checkbox,
					current: step.args.onehot,
					onChange: (s, val) => (s.args.onehot = val as boolean),
					styles: {
						root: {
							marginTop: 8,
						},
					},
					advanced: true,
				},
			],
			[step],
		)
		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
