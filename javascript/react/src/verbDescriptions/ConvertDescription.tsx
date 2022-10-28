/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@datashaper/schema'
import { ParseType } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const ConvertDescription: React.FC<StepDescriptionProps<ConvertArgs>> =
	memo(function ConvertDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: `convert column`,
					value: args.column,
				},
				{
					before: 'to type',
					value: args.type,
					sub:
						args.type === ParseType.Integer
							? [
									{
										before: 'with base',
										value: args.radix,
									},
							  ]
							: undefined,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
