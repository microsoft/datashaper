/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import { useSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'
import { memo, useMemo } from 'react'

import type { FormInput } from '../../common/VerbForm.js'
import { FormInputType, VerbForm } from '../../common/VerbForm.js'
import { enumDropdown } from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '@data-wrangling-components/react-types'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const PivotBase: React.FC<
	StepComponentBaseProps<PivotArgs> & { columns: string[] }
> = memo(function PivotBase({ step, onChange, columns }) {
	const options = useSimpleDropdownOptions(columns)

	const inputs = useMemo<FormInput<PivotArgs>[]>(
		() => [
			{
				label: 'Column used as key',
				type: FormInputType.SingleChoice,
				current: step.args.key,
				options,
				onChange: (s, val) => (s.args.key = val as string),
			},
			{
				label: 'Column used as value',
				type: FormInputType.SingleChoice,
				current: step.args.value,
				options,
				onChange: (s, val) => (s.args.value = val as string),
			},
			enumDropdown(
				'Function',
				FieldAggregateOperation,
				step.args.operation,
				(s, val) => (s.args.operation = val as FieldAggregateOperation),
			),
		],
		[step, options],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
