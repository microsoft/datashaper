/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'
import { toggleListItem } from '@datashaper/utilities'

import { type FormInput, FormInputType, VerbForm } from '../forms/index.js'
import type { StepFormBaseProps } from '../types.js'
import { getSimpleDropdownOptions } from '../../../../hooks/fluent/useSimpleDropdownOptions.js'
import { EMPTY_ARRAY } from '../../../../empty.js'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const DestructureFormBase: React.FC<StepFormBaseProps<DestructureArgs> & {
	keyNames: string[]
}> =
	memo(function DestructureFormBase({ step, onChange, keyNames }) {
		const inputs = useMemo<FormInput<DestructureArgs>[]>(
			() => [
				{
					label: 'Keys to filter',
					placeholder: 'Choose keys',
					required: false,
					type: FormInputType.MultiChoice,
					current: step.args.keys,
					options: getSimpleDropdownOptions(keyNames),
					onChange: (s, val) => {
						s.args.keys = toggleListItem(
							s.args.keys ?? EMPTY_ARRAY,
							val as string,
						)
					},
					onChangeAll: (s, val) => {
						s.args.keys = val as string[]
					},
				},
				{
					label: 'Keep source column',
					type: FormInputType.Checkbox,
					current: step.args.preserveSource,
					onChange: (s, val) => {
						s.args.preserveSource = val as boolean
					},
					advanced: false,
				},
			],
			[step, keyNames],
		)

		return <VerbForm inputs={inputs} step={step} onChange={onChange} />
	})

