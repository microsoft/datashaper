/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterStep, FilterCompareType } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const FilterDescription: React.FC<StepDescriptionProps> = memo(
	function FilterDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as FilterStep
			const { args } = internal
			return [
				{
					pre: 'where',
					value: args.column,
					post: 'row value',
					sub: [
						{
							value: `${args.operator} ${args.value}`,
							post: args.type === FilterCompareType.Column ? 'row value' : '',
						},
					],
				},
			] as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)
