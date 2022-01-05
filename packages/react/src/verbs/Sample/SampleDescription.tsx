/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SampleStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SampleDescription: React.FC<StepDescriptionProps> = memo(
	function SampleDescription({ step }) {
		const rows = useMemo(() => {
			const internal = step as SampleStep
			const { args } = internal
			return [
				{
					value: args.size || (args.proportion || 0) * 100,
					post: args.size ? 'rows' : '% of rows',
				},
			] as DescriptionRow[]
		}, [step])
		return <VerbDescription verb={step.verb} rows={rows} />
	},
)
