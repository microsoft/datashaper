/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StringsReplaceArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const StringsReplaceDescription: React.FC<StepDescriptionProps<StringsReplaceArgs>> = memo(
	function StringsReplaceDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'replace column',
					value: args.column ?? '',
				},
				{
					before: 'match pattern',
					value: args.pattern,
				},
				{
					before: 'with value',
					value: args.replacement,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
