/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowArgs } from '@datashaper/schema'
import { memo, useMemo } from 'react'

import type { StepDescriptionProps } from './types.js'
import { VerbDescription } from './VerbDescription.js'

export const WorkflowDescription: React.FC<StepDescriptionProps<WorkflowArgs>> =
	memo(function WorkflowDescription(props) {
		const rows = useMemo(() => {
			const {
				step: { args },
			} = props
			return [
				{
					before: 'workflow with',
					value: args.workflow.steps?.length ?? 0,
					after: 'steps',
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
