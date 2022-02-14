/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecodeStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import { DescriptionRow, VerbDescription } from '../..'
import { StepDescriptionProps } from '../../types'

// prevent the displayed list from getting too long
const MAX_LIST = 10

export const RecodeDescription: React.FC<StepDescriptionProps> = memo(
	function RecodeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as RecodeStep
			const { args } = internal
			const entries = Object.entries(args.map || {})
			const maps: DescriptionRow[] = entries.slice(0, MAX_LIST).map(c => ({
				value: `${c[0]} -> ${c[1]}`,
			}))
			const remaining = entries.length - maps.length
			if (remaining > 0) {
				maps.push({
					before: `+${remaining} more...`,
					value: '',
				})
			}
			return [
				{
					before: 'from column',
					value: args.column,
				},
				{
					before: 'into column',
					value: args.to,
				},
				...maps,
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
