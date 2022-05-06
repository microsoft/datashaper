/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const FetchDescription: React.FC<StepDescriptionProps<FetchArgs>> = memo(
	function FetchDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
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
