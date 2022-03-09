/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const SpreadDescription: React.FC<StepDescriptionProps> = memo(
	function SpreadDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SpreadStep
			const { args } = internal
			return [
				{
					before: 'Into column',
					value: args.column,
				},
				{
					before: `column${(args.to || []).length !== 1 ? 's' : ''}`,
					value: args.to ? args.to.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
