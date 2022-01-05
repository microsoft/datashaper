/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FillStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const FillDescription: React.FC<StepDescriptionProps> = memo(
	function FillDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as FillStep
			const { args } = internal
			return [
				{
					pre: 'with',
					value: args.value,
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
