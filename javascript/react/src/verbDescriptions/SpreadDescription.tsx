/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const SpreadDescription: React.FC<StepDescriptionProps<SpreadArgs>> =
	memo(function SpreadDescription(props) {
		const {
			step: { args },
		} = props
		const sub = createRowEntries(args.columns, value => ({ value }), 3, props)
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: `column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'split delimiter',
					value: args.delimiter,
				},
				{
					before: 'onehot values',
					value: args.onehot ? `yes` : 'no',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
