/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnListStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { createRowEntries, VerbDescription } from '../../index.js'
import type { StepDescriptionProps } from '../../types.js'

export const ColumnListOperationDescription: React.FC<StepDescriptionProps> =
	memo(function ColumnListOperationDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as ColumnListStep
			const { args } = internal
			const sub = createRowEntries(
				args.columns || [],
				c => ({
					value: c,
				}),
				1,
				props,
			)
			return [
				{
					before: `column${args.columns.length !== 1 ? 's' : ''}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
