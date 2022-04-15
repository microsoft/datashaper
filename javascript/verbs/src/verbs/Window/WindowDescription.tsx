/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

export const WindowDescription: React.FC<StepDescriptionProps> = memo(
	function WindowDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as WindowStep
			const { args } = internal
			return [
				{
					before: 'window column',
					value: args.column,
					sub: [
						{
							before: 'with function',
							value: args.operation,
						},
					],
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
