/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const FoldFormBase: React.FC<StepFormBaseProps<FoldArgs>> = memo(
	function FoldBase({ step, onChange }) {
		const inputs = useMemo<FormInput<FoldArgs>[]>(
			() => [
				{
					label: 'Key name to use',
					placeholder: 'Key name to use',
					type: FormInputType.Text,
					required: true,
					current: step.args.to ? step.args.to[0] : '',
					onChange: (s, val) => (s.args.to[0] = val as string),
				},
				{
					label: 'Value name to use',
					placeholder: 'Value name to use',
					type: FormInputType.Text,
					required: true,
					current: step.args.to ? step.args.to[1] : '',
					onChange: (s, val) => (s.args.to[1] = val as string),
				},
			],
			[step],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	},
)
