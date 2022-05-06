/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '../types.js'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../verbForm/VerbDescription.js'

export const RollupDescription: React.FC<StepDescriptionProps<RollupArgs>> =
	memo(function RollupDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'rollup column',
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
