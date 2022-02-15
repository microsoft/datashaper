/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const DeriveDescription: React.FC<StepDescriptionProps> = memo(
	function DeriveDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as DeriveStep
			const { args } = internal
			return [
				{
					before: 'into column',
					value: args.to,
				},
				{
					value: `${args.column1 || ''} ${args.operator || ''} ${
						args.column2 || ''
					}`,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
