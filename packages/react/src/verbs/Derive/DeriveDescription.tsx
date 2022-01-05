/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DeriveStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const DeriveDescription: React.FC<StepDescriptionProps> = memo(
	function DeriveDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as DeriveStep
			const { args } = internal
			return [
				{
					value: `${args.column1} ${args.operator} ${args.column2}`,
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
