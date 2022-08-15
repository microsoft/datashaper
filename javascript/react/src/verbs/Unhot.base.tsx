/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@datashaper/core'
import { memo, useMemo } from 'react'

import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const UnhotBase: React.FC<
	StepComponentBaseProps<UnhotArgs> & { columns: string[] }
> = memo(function UnhotBase({ step, onChange, columns }) {
	const inputs = useMemo<FormInput<UnhotArgs>[]>(
		() => [
			inputColumnList(step, columns),
			{
				label: 'Keep original columns',
				type: FormInputType.Checkbox,
				current: step.args.keepOriginalColumns,
				onChange: (s, val) => (s.args.keepOriginalColumns = val as boolean),
				advanced: true,
			},
			{
				label: 'Prefix',
				type: FormInputType.Text,
				current: step.args.prefix,
				onChange: (s, val) => (s.args.prefix = val as string),
				advanced: true,
			},
		],
		[step, columns],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
