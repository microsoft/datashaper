/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const FetchDescription: React.FC<StepDescriptionProps> = memo(
	function FetchDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as FetchStep
			const { args } = internal
			return [
				{
					before: 'url',
					value: args.url,
				},
				{
					before: 'with delimiter',
					value: args.delimiter,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
