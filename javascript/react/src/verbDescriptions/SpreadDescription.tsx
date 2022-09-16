/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const SpreadDescription: React.FC<StepDescriptionProps<SpreadArgs>> =
	memo(function SpreadDescription(props) {
		const {
			step: { args },
		} = props
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: `column`,
					value: args.column !== undefined ? args.column : undefined,
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
