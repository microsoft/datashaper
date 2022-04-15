/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../common/createRowEntries.js'
import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

export const RecodeDescription: React.FC<StepDescriptionProps> = memo(
	function RecodeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as RecodeStep
			const { args } = internal
			const entries = Object.entries(args.map || {})
			const sub = createRowEntries(
				entries,
				c => ({
					value: `${c[0]} -> ${c[1]}`,
				}),
				2,
				props,
			)
			return [
				{
					before: 'from column',
					value: args.column,
				},
				{
					before: 'values',
					value: entries.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
