/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import { NodeInput } from '@datashaper/workflow'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'
import { getInputNode } from '../../../util.js'

export const JoinDescription: React.FC<StepDescriptionProps<JoinArgs>> = memo(
	function JoinDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'with',
					value: getInputNode(props.step, NodeInput.Other) ?? '',
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
