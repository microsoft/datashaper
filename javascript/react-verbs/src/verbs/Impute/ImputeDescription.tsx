/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ImputeArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { memo, useMemo } from 'react'

import { createRowEntries } from '../../common/createRowEntries.js'
import { VerbDescription } from '../../common/VerbDescription.js'

export const ImputeDescription: React.FC<StepDescriptionProps<ImputeArgs>> =
	memo(function ImputeDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.columns,
				c => ({
					value: c,
				}),
				3,
				props,
			)
			return [
				{
					before: `impute column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
				{
					before: 'with value',
					value: args.value,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
