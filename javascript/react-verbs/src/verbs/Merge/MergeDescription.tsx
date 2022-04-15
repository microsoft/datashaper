/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../common/createRowEntries.js'
import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

export const MergeDescription: React.FC<StepDescriptionProps> = memo(
	function MergeDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as MergeStep
			const { args } = internal
			const sub = createRowEntries(
				args.columns || [],
				c => ({
					value: c,
				}),
				1,
				props,
			)
			return [
				{
					before: `column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns?.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'with strategy',
					value: args.strategy,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
