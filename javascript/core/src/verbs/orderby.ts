/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'

import type { TableStep } from './nodeFactories/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import { SortDirection } from './types.js'

export interface OrderbyArgs {
	/**
	 * List of ordering instructions to apply
	 */
	orders: OrderbyInstruction[]
}

export interface OrderbyInstruction {
	column: string
	direction?: SortDirection
}

export const orderbyStep: TableStep<OrderbyArgs> = (input, { orders }) =>
	// format keys in arquero-compatible format
	// https://uwdata.github.io/arquero/api/verbs#orderby
	input.orderby(...orders.map(orderColumn))

function orderColumn({ column, direction }: OrderbyInstruction) {
	return direction === SortDirection.Descending ? desc(column) : column
}

export const orderby = stepNodeFactory(orderbyStep)
