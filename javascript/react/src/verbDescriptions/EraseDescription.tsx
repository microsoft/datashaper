/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const EraseDescription: React.FC<StepDescriptionProps<EraseArgs>> = memo(
	function EraseDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.column.split(' '),
				c => ({
					value: c,
				}),
				3,
				props,
			)
			return [
				{
					before: `erase column`,
					value: args.column === undefined ? undefined : '',
					sub,
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
