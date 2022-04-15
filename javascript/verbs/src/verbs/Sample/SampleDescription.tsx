/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleStep } from '@data-wrangling-components/core'
import { format } from 'd3-format'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'
import type { StepDescriptionProps } from '../../types.js'

const perc = format('.0%')

export const SampleDescription: React.FC<StepDescriptionProps> = memo(
	function SampleDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as SampleStep
			const { args } = internal
			return [
				{
					before: 'random',
					value: args.size || perc(args.proportion || 0),
					after: args.size ? (args.size === 1 ? 'row' : 'rows') : ' of rows',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
