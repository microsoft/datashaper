/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '../types.js'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const RenameDescription: React.FC<StepDescriptionProps<RenameArgs>> =
	memo(function RenameDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const entries = Object.entries(args.columns || {})
			const sub = createRowEntries(
				entries,
				c => ({
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
