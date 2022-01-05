/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BinarizeStep,
	FilterCompareType,
} from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const BinarizeDescription: React.FC<StepDescriptionProps> = memo(
	function BinarizeDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as BinarizeStep
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
				{
					pre: 'as',
					value: args.as,
				},
			] as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)
