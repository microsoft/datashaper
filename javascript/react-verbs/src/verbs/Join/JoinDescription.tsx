/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import type { StepDescriptionProps } from '@data-wrangling-components/react-types'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'

import { VerbDescription } from '../../common/VerbDescription.js'

export const JoinDescription: React.FC<StepDescriptionProps<JoinArgs>> = memo(
	function JoinDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'with',
					value: props.step.input[NodeInput.Other]?.node,
				},
				{
					before: 'on',
					value: args.on?.join(' | '),
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	},
)
