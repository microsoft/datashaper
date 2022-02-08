/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpreadStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../../'
import { StepDescriptionProps } from '../../types'

export const SpreadDescription: React.FC<StepDescriptionProps> = memo(
	function SpreadDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SpreadStep
			const { args } = internal
			return [
				{
					before: 'Into column',
					value: args.column,
				},
				{
					before: `column${(args.columns || []).length !== 1 ? 's' : ''}`,
					value: args.columns ? args.columns.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
