/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnhotArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const UnhotDescription: React.FC<StepDescriptionProps<UnhotArgs>> = memo(
	function UnhotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
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
					before: `column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns?.length === 0 ? undefined : '',
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
