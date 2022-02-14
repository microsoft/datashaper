/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FillStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const FillDescription: React.FC<StepDescriptionProps> = memo(
	function FillDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as FillStep
			const { args } = internal
			return [
				{
					before: 'into column',
					value: args.to,
				},
				{
					before: 'with value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
