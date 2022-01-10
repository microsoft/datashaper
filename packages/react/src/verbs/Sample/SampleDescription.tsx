/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SampleStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const SampleDescription: React.FC<StepDescriptionProps> = memo(
	function SampleDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SampleStep
			const { args } = internal
			return [
				{
					before: 'random',
					value: args.size || (args.proportion || 0) * 100,
					after: args.proportion ? '% of rows' : 'rows',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
