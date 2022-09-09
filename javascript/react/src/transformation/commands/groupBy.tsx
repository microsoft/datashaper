/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupbyArgs } from '@datashaper/schema'
import { Verb } from '@datashaper/schema'
import type { Step, Workflow } from '@datashaper/workflow'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../types.js'
import { findStep } from './utils.js'

export function groupby(
	column: string,
	workflow: Workflow,
	onAddStep: StepAddFunction,
	onUpdateStep?: StepUpdateFunction,
	onRemoveStep?: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: Verb.Groupby,
		text: 'Group by column',
		onRender: () => {
			const template = {
				verb: Verb.Groupby,
				args: {
					columns: [column],
				},
			} as Step<GroupbyArgs>
			const { step, index } = findStep<GroupbyArgs>(workflow.steps, template)
			const entry = step?.args.columns.find(c => c === column)
			const click = () => {
				if (!step) {
					// first convert, add with the single column
					const id = workflow.suggestOutputName(template.verb)
					template.id = id
					template.args = {
						columns: [column],
					}
					onAddStep(template, template.id)
				} else {
					if (entry) {
						const updated = step.args.columns.filter(c => c !== column)
						if (updated.length === 0) {
							// last column - remove the step entirely
							onRemoveStep && onRemoveStep(index)
						} else {
							// otherwise pass the filtered list on
							onUpdateStep &&
								onUpdateStep(
									{
										...step,
										args: {
											...step.args,
											columns: updated,
										},
									},
									step.id,
									index,
								)
						}
					} else {
						// add this as a new column
						onUpdateStep &&
							onUpdateStep(
								{
									...step,
									args: {
										...step.args,
										columns: [...step.args.columns, column],
									},
								},
								step.id,
								index,
							)
					}
				}
			}
			return (
				<IconButton
					checked={!!entry}
					onClick={click}
					iconProps={{ iconName: 'GroupList' }}
				/>
			)
		},
	}
}
