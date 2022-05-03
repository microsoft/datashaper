/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'

export const PivotDescription: React.FC<StepDescriptionProps<PivotArgs>> = memo(
	function PivotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column to use as key',
					value: args.key,
				},
				{
					before: 'column to use as value',
					value: args.value,
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
