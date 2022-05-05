/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { format } from 'd3-format'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'

const perc = format('.0%')

export const SampleDescription: React.FC<StepDescriptionProps<SampleArgs>> =
	memo(function SampleDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'random',
					value: args.size || perc(args.proportion || 0),
					after: args.size ? (args.size === 1 ? 'row' : 'rows') : ' of rows',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
