/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs, Step } from '@data-wrangling-components/core'
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
	const inputs = useMemo<FormInput<OnehotArgs>[]>(() => {
		if (!step.args.prefixes) {
			step.args.prefixes = []
		}
		const prefixInputs = step.args.columns.map((column, index) => {
			return {
				label: `Prefix for column ${column}`,
				type: FormInputType.Text,
				current: step.args.prefixes?.[index] ?? `${column}_`,
				onChange: (s: Step<OnehotArgs>, val: string) =>
					s.args.prefixes && (s.args.prefixes[index] = val),
			}
		})
		return [
			inputColumnList(step, columns, 'Columns to onehot'),
			...prefixInputs,
		] as FormInput<OnehotArgs>[]
	}, [step, columns])
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
