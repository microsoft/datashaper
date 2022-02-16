/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import type { StepDescriptionProps } from '../../types'

export const UnfoldDescription: React.FC<StepDescriptionProps> = memo(
	function UnfoldDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as UnfoldStep
			const { args } = internal
			return [
				{
					before: 'column to use as key',
					value: args.key,
				},
				{
					before: 'column to use as value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
