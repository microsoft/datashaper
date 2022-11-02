/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import type { StepDescriptionProps } from '../../../types.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import { VerbDescription } from './VerbDescription.js'

export const FoldDescription: React.FC<StepDescriptionProps<FoldArgs>> = memo(
	function FoldDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns || EMPTY_ARRAY,
				c => ({
					value: c,
				}),
				3,
				props,
			)
			return [
				{
					before: `column${
						(args.columns || EMPTY_ARRAY).length !== 1 ? 's' : ''
					}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'into key column',
					value: args.to != null ? args.to[0] : '',
				},
				{
					before: 'into value column',
					value: args.to != null ? args.to[1] : '',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
