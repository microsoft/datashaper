/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DecodeArgs } from '@datashaper/schema'
import { useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { VerbForm } from '../verbForm/VerbForm.js'
import { checkbox } from '../verbForm/VerbFormFactories.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const DecodeBase: React.FC<StepComponentBaseProps<DecodeArgs>> =
	function DecodeBase({ step, onChange }) {
		const verbInputs = useMemo<FormInput<DecodeArgs>[]>(
			() => [
				checkbox(
					'Unapply mapping',
					step.args.unapplyMapping,
					(s, val) => (s.args.unapplyMapping = val as boolean),
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

		return <VerbForm step={step} inputs={verbInputs} onChange={onChange} />
	}
