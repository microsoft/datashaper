/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@datashaper/schema'
import { SortDirection, Verb } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import type { ICommandBarItemProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'

import type {
	StepAddFunction,
	StepRemoveFunction,
	StepUpdateFunction,
} from '../types.js'

export function orderby(
	column: string,
	steps: Step[],
	onAddStep: StepAddFunction,
	onUpdateStep?: StepUpdateFunction,
	onRemoveStep?: StepRemoveFunction,
): ICommandBarItemProps {
	return {
		key: 'orderby',
		text: 'Sort column',
		onRender: () => {
			const step = {} as Step<OrderbyArgs>
			step.verb = Verb.Orderby
			step.id = 'abcdefyh'
			step.args = {
				orders: [{ column, direction: SortDirection.Ascending }],
			}
			const entry = step?.args.orders.find(e => e.column === column)
			const order = entry?.direction
			const click = () => {
				if (!steps.length) {
					onAddStep(step, 'order-ar')
				} else {
					if (entry) {
						// check the direction to decide whether we flip it or remove it
						if (order === SortDirection.Ascending) {
							const index =
								step?.args?.orders.findIndex(e => e.column === column) || 0
							const update = [...(step?.args?.orders || [])]
							update[index] = {
								column,
								direction: SortDirection.Descending,
							}
							onUpdateStep &&
								onUpdateStep(step, {
									...step,
									args: {
										...step.args,
										orders: update,
									},
								})
						} else {
							// remove it
							const filtered = step?.args?.orders.filter(
								e => e.column !== column,
							)
							if (filtered?.length === 0) {
								onRemoveStep && onRemoveStep(step)
							} else {
								onUpdateStep &&
									onUpdateStep(step, {
										...step,
										args: {
											...step.args,
											orders: filtered,
										},
									})
							}
						}
					} else {
						// brand new order
						onUpdateStep &&
							onUpdateStep(step, {
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
							})
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
