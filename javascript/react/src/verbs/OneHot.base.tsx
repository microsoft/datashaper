/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a OneHot step.
 */
export const OneHotBase: React.FC<
	StepComponentBaseProps<OnehotArgs> & { columns: string[] }
> = memo(function OneHotBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<OnehotArgs>[]>(
		() => [
			inputColumnList(step, columns, 'Columns to onehot'),
			{
				label: 'Prefix',
				type: FormInputType.Text,
				current: step.args.prefix,
				onChange: (s, val) => (s.args.prefix = val as string),
			},
		],
		[step, columns],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
