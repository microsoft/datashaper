/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StringsReplaceArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { type FormInput, FormInputType, VerbForm } from '../../forms/index.js'
import type { StepFormProps } from '../../types.js'

/**
 * Provides inputs for a StringsReplace step.
 */
export const StringsReplaceFormBase: React.FC<
	StepFormProps<StringsReplaceArgs>
> = memo(function StringsReplaceFormBase({ step, onChange }) {
	const inputs = useMemo<FormInput<StringsReplaceArgs>[]>(
		() => [
			{
				label: 'Pattern',
				type: FormInputType.Text,
				current: step.args.pattern,
				onChange: (s, val) => {
					s.args.pattern = val as string
				},
			},
			{
				label: 'Replacement',
				type: FormInputType.Text,
				current: step.args.replacement,
				onChange: (s, val) => {
					s.args.replacement = val as string
				},
			},
			{
				label: 'Global search',
				type: FormInputType.Checkbox,
				current: step.args.globalSearch,
				advanced: true,
				onChange: (s, val) => {
					s.args.globalSearch = val as boolean
				},
			},
			{
				label: 'Case insensitive match',
				type: FormInputType.Checkbox,
				current: step.args.caseInsensitive,
				advanced: true,
				onChange: (s, val) => {
					s.args.caseInsensitive = val as boolean
				},
			},
		],
		[step],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
