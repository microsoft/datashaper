/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JoinStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

export const JoinDescription: React.FC<StepDescriptionProps> = memo(
	function JoinDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as JoinStep
			const { args } = internal
			return [
				{
					before: 'with',
					value: args.other,
				},
				{
					before: 'on',
					value: args.on?.join(' | '),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
