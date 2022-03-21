/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const EraseDescription: React.FC<StepDescriptionProps> = memo(
	function EraseDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as EraseStep
			const { args } = internal
			return [
				{
					before: 'column',
					value: args.column,
				},
				{
					before: 'value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
