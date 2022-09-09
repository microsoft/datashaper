/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@datashaper/schema'
import { SortDirection, Verb } from '@datashaper/schema'
import type { Step, Workflow } from '@datashaper/workflow'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import isMatch from 'lodash-es/isMatch.js'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../types.js'

export function orderby(
	column: string,
	workflow: Workflow,
	onAddStep: StepAddFunction,
	onUpdateStep?: StepUpdateFunction,
	onRemoveStep?: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'orderby',
		text: 'Sort column',
		onRender: () => {
			const template = {
				verb: Verb.Orderby,
			} as Step<OrderbyArgs>

			const stepIndex = workflow.steps.findIndex(step =>
				isMatch(step as any, template as any),
			)
			const step = workflow.steps[stepIndex] as Step<OrderbyArgs>
			const entry = step?.args?.orders.find(e => e.column === column)
			const order = entry?.direction
			const click = () => {
				if (!workflow.steps.length) {
					const id = workflow.suggestOutputName(template.verb)
					template.id = id
					template.args = {
						orders: [{ column, direction: SortDirection.Ascending }],
					}
					onAddStep(template, template.id)
				} else {
					if (entry) {
						// check the direction to decide whether we flip it or remove it
						const entryIndex =
							step?.args?.orders.findIndex(e => e.column === column) || 0
						if (order === SortDirection.Ascending) {
							const update = [...(step?.args?.orders || [])]
							update[entryIndex] = {
								column,
								direction: SortDirection.Descending,
							}
							onUpdateStep &&
								onUpdateStep(
									{
										...step,
										args: {
											...step.args,
											orders: update,
										},
									},
									step.id,
									stepIndex,
								)
						} else {
							// remove it
							const filtered = step?.args?.orders.filter(
								e => e.column !== column,
							)
							if (filtered?.length === 0) {
								onRemoveStep && onRemoveStep(stepIndex)
							} else {
								onUpdateStep &&
									onUpdateStep(
										{
											...step,
											args: {
												...step.args,
												orders: filtered,
											},
										},
										step.id,
										stepIndex,
									)
							}
						}
					} else {
						// brand new order
						onUpdateStep &&
							onUpdateStep(
								{
									...step,
									args: {
										...step.args,
										orders: [
											...(step?.args?.orders || []),
											{
												column,
												direction: SortDirection.Ascending,
											},
										],
									},
								},
								step.id,
								stepIndex,
							)
					}
				}
			}

			const title =
				order === SortDirection.Ascending
					? `Order table descending by ${column}`
					: order === SortDirection.Descending
					? `Remove table order by ${column}`
					: `Order table ascending by ${column}`

			const icon =
				order === SortDirection.Ascending
					? `SortUp`
					: order === SortDirection.Descending
					? `sortDown`
					: `Sort`

			return (
				<IconButton
					title={title}
					checked={!!entry}
					iconProps={{ iconName: icon }}
					onClick={click}
				/>
			)
		},
	}
}
