/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '../types.js'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../verbForm/VerbDescription.js'

export const SpreadDescription: React.FC<StepDescriptionProps<SpreadArgs>> =
	memo(function SpreadDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'column',
					value: args.column,
				},
				{
					before: `as column${(args.to || []).length !== 1 ? 's' : ''}`,
					value: args.to ? args.to.join(', ') : null,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
