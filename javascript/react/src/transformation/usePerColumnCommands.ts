/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { useMemo } from 'react'

import { createDefaultCommandBar } from '../component-factories.js'
import { orderby } from './commands/orderBy.js'
import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from './types.js'

export function usePerColumnCommands(
	steps: Step[],
	onAddStep: StepAddFunction,
	onUpdateStep?: StepUpdateFunction,
	onRemoveStep?: StepRemoveFunction,
): any {
	return useMemo(() => {
		return (props: any) => {
			const column = props?.column.key
			return createDefaultCommandBar({
				items: [orderby(column, steps, onAddStep, onUpdateStep, onRemoveStep)],
			})
		}
	}, [steps, onAddStep, onRemoveStep, onUpdateStep])
}
