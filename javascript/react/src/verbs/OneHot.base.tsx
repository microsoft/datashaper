/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs, Step } from '@data-wrangling-components/core'
import cloneDeep from 'lodash-es/cloneDeep'
import { memo, useCallback, useMemo } from 'react'

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
	const prefixInputs = useMemo(() => {
		return step.args.columns.map(column => {
			return {
				label: `Prefix for column ${column}`,
				type: FormInputType.Text,
				current: step.args.prefixes?.[column],
				onChange: (s: Step<OnehotArgs>, val: string) =>
					s.args.prefixes && (s.args.prefixes[column] = val),
			}
		})
	}, [step])

	const inputs = useMemo<FormInput<OnehotArgs>[]>(() => {
		return [
			inputColumnList(step, columns, 'Columns to onehot'),
			...prefixInputs,
		] as FormInput<OnehotArgs>[]
	}, [step, columns, prefixInputs])

	const onStepChange = useCallback(
		(s: Step<OnehotArgs>) => {
			const step = cloneDeep(s)
			if (!step.args.prefixes) {
				step.args.prefixes = {}
			} else {
				const prefixes = setInitialPrefixes(step)
				const cols = Object.keys(prefixes)
				const columns = step.args.columns
				cols.forEach(column => {
					if (!columns.includes(column)) {
						delete step.args.prefixes?.[column]
					} else if (
						(step.args.prefixes as Record<string, string>)[column] === undefined
					) {
						;(step.args.prefixes as Record<string, string>)[column] = prefixes[
							column
						] as string
					}
				})
			}
			onChange?.(step)
		},
		[onChange],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onStepChange} />
})

function setInitialPrefixes(step: Step<OnehotArgs>): Record<string, string> {
	return step.args.columns.reduce((acc, curr: string) => {
		if (acc[curr] === undefined) {
			acc[curr] = `${curr}_`
		}
		return acc
	}, {} as Record<string, string>)
}
