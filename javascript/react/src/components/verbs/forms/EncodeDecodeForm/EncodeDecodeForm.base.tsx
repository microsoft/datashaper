/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeDecodeArgs } from '@datashaper/schema'
import { CodebookStrategy } from '@datashaper/schema'
import { useMemo } from 'react'

import { type FormInput, VerbForm, enumDropdown } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EncodeDecodeFormBase: React.FC<
	StepFormBaseProps<EncodeDecodeArgs>
> = function EncodeDecodeFormBase({ step, onChange }) {
	const verbInputs = useMemo<FormInput<EncodeDecodeArgs>[]>(
		() => [
			enumDropdown(
				'Codebook strategy',
				CodebookStrategy,
				step.args.strategy,
				(s, opt) => {
					s.args.strategy = opt as CodebookStrategy
				},
				{ required: true, placeholder: 'Choose strategy' },
			),
		],
		[step],
	)

	return <VerbForm step={step} inputs={verbInputs} onChange={onChange} />
}
