/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'

import type { OrderbyArgs, OrderbyInstruction } from './types.js'
import { SortDirection } from './enums.js'
import { makeStepNode } from './util/factories.js'

export const orderby = makeStepNode<OrderbyArgs>((input, { orders }) =>
	// format keys in arquero-compatible format
	// https://uwdata.github.io/arquero/api/verbs#orderby
	input.orderby(...orders.map(orderColumn)),
)

function orderColumn({ column, direction }: OrderbyInstruction) {
	return direction === SortDirection.Descending ? desc(column) : column
}
