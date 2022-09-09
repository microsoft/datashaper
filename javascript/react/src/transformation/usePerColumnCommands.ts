/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useMemo } from 'react'

import { createDefaultCommandBar } from '../component-factories.js'
import { groupby } from './commands/groupBy.js'
import { orderby } from './commands/orderBy.js'
import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from './types.js'

export function usePerColumnCommands(
	workflow: Workflow,
	onAddStep: StepAddFunction,
	onUpdateStep?: StepUpdateFunction,
	onRemoveStep?: StepRemoveFunction,
): any {
	return useMemo(() => {
		return (props: any) => {
			const column = props?.column.key
			return createDefaultCommandBar({
				items: [
					orderby(column, workflow, onAddStep, onUpdateStep, onRemoveStep),
					groupby(column, workflow, onAddStep, onUpdateStep, onRemoveStep),
				],
			})
		}
	}, [workflow, onAddStep, onRemoveStep, onUpdateStep])
}
