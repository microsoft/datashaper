/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.jsx'
import { FormInputType, VerbForm } from '../../common/VerbForm.jsx'
import { selectColumnListInput } from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const FoldBase: React.FC<
	StepComponentBaseProps<FoldArgs> & {
		columns: string[]
	}
> = memo(function FoldBase({ step, columns, onChange }) {
	const inputs = useMemo<FormInput<FoldArgs>[]>(
		() => [
			selectColumnListInput(step, columns),
			{
				label: 'Key name to use',
				placeholder: 'Key name to use',
				type: FormInputType.Text,
				required: true,
				current: step.args.to ? step.args.to[0] : '',
				onChange: (s, val) => (s.args.to![0] = val as string),
			},
			{
				label: 'Value name to use',
				placeholder: 'Value name to use',
				type: FormInputType.Text,
				required: true,
				current: step.args.to ? step.args.to[1] : '',
				onChange: (s, val) => (s.args.to![1] = val as string),
			},
		],
		[step, columns],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
