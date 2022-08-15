/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OnehotArgs } from '@datashaper/core'
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
				args.columns,
				c => ({
					value: c,
				}),
				3,
				props,
			)
			const prefixes = Object.values(args.prefixes || {})
			const prefixSub = createRowEntries(
				prefixes,
				c => ({
					value: c,
				}),
				2,
				props,
			)
			return [
				{
					before: `onehot column${args.columns?.length !== 1 ? 's' : ''}`,
					value: args.columns.length === 0 ? undefined : '',
					sub,
				},
				{
					before: `with prefix${prefixes?.length !== 1 ? 'es' : ''}`,
					value: prefixes?.length === 0 ? undefined : '',
					sub: prefixSub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
