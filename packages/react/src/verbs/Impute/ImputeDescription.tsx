/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImputeStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const ImputeDescription: React.FC<StepDescriptionProps> = memo(
	function ImputeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as ImputeStep
			const { args } = internal
			return [
				{
					before: 'column',
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
