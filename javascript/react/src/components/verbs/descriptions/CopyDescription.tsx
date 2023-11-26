/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'
import type { CopyArgs } from '@datashaper/schema'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const CopyDescription: React.FC<StepDescriptionProps<CopyArgs>> = memo(
	function CopyDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'test',
					value: args.test,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
