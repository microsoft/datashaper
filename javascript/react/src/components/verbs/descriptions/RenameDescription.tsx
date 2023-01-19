/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { EMPTY_OBJECT } from '../../../empty.js'
import { createRowEntries } from '../../StepDescription/createRowEntries.js'
import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const RenameDescription: React.FC<StepDescriptionProps<RenameArgs>> =
	memo(function RenameDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const entries = Object.entries(args.columns || EMPTY_OBJECT)
			const sub = createRowEntries(
				entries,
				(c) => ({
					value: `${c[0]} -> ${c[1]}`,
				}),
				1,
				props,
			)
			return [
				{
					before: 'columns',
					value: entries.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
