/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EncodeArgs } from '@datashaper/schema'
import { useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import { checkbox } from '../verbForm/VerbFormFactories.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const EncodeBase: React.FC<StepComponentBaseProps<EncodeArgs>> =
	function EncodeBase({ step, onChange }) {
		const verbInputs = useMemo<FormInput<EncodeArgs>[]>(
			() => [
				checkbox(
					'Apply mapping',
					step.args.applyMapping,
					(s, val) => (s.args.applyMapping = val as boolean),
					{
						styles: {
							root: {
								marginTop: 8,
							},
						},
					},
				),
			],
			[step],
		)

		console.log(step)
		return <VerbForm step={step} inputs={verbInputs} onChange={onChange} />
	}
