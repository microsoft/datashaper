/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const SpreadDescription: React.FC<StepDescriptionProps<SpreadArgs>> =
	memo(function SpreadDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column',
					value: args.column,
				},
				{
					before: 'keep source column',
					value: args.preserveSource ? 'yes' : 'no',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
