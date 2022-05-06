/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const RecodeDescription: React.FC<StepDescriptionProps<RecodeArgs>> =
	memo(function RecodeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
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
	})
