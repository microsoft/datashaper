/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LookupStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../index.js'
import { StepDescriptionProps } from '../../types.js'

export const LookupDescription: React.FC<StepDescriptionProps> = memo(
	function LookupDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as LookupStep
			const { args } = internal
			return [
				{
					before: 'lookup from',
					value: args.other,
				},
				{
					before: 'on',
					value: args.on?.join(' | '),
				},
				{
					before: 'copy columns',
					value: args.columns.length > 0 ? args.columns.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
