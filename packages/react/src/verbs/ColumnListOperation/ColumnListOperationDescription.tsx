/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnListStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { VerbDescription } from '../../index.js'
import { StepDescriptionProps } from '../../types.js'

export const ColumnListOperationDescription: React.FC<StepDescriptionProps> =
	memo(function ColumnListOperationDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as ColumnListStep
			const { args } = internal
			return [
				{
					before: `using column${args.columns.length !== 1 ? 's' : ''}`,
					value: args.columns.length > 0 ? args.columns.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
