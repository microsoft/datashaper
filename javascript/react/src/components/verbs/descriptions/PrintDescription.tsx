/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PrintArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const PrintDescription: React.FC<StepDescriptionProps<PrintArgs>> = memo(
	function PrintDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'message to print',
					value: args.message,
				},
				{
					before: 'with limit',
					value: args.limit,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
