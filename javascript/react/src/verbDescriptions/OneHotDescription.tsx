/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const OneHotDescription: React.FC<StepDescriptionProps<OnehotArgs>> =
	memo(function OneHotDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			const sub = createRowEntries(
				args.column.split(' '),
				c => ({
					value: c,
				}),
				3,
				props,
			)
			const prefixSub = createRowEntries(
				args.prefix !== undefined ? args.prefix.split(' ') : [''],
				c => ({
					value: c,
				}),
				2,
				props,
			)
			return [
				{
					before: `onehot column`,
					value: args.column === undefined ? undefined : '',
					sub,
				},
				{
					before: `with prefix${args.prefix}`,
					value: args.prefix,
					sub: prefixSub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
