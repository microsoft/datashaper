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
import { DataType } from '@datashaper/schema'

/**
 * Just the json object inputs for spread json.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const DestructureFormBase: React.FC<
	StepFormBaseProps<DestructureArgs> & {
		keyNames: string[],
		columnDataType: DataType
	}
> = memo(function DestructureFormBase({ step, onChange, keyNames, columnDataType }) {
	const inputs = useMemo<FormInput<DestructureArgs>[]>(
		() => [
			{
				label: 'Keys to filter',
				placeholder: 'Choose keys',
				required: false,
				if: columnDataType === DataType.Object,
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
				label: 'Column prefix',
				type: FormInputType.Text,
				current: step.args.prefix,
				placeholder: 'Enter a prefix',
				if: columnDataType === DataType.Array,
				required: false,
				onChange: (s, val) => {
					s.args.prefix = val as string
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
		[step, keyNames, columnDataType],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
