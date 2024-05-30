/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import { VerbDescription } from './VerbDescription.js'
import type { StepDescriptionProps } from './types.js'

export const WindowDescription: React.FC<StepDescriptionProps<WindowArgs>> =
	memo(function WindowDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
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
	})
