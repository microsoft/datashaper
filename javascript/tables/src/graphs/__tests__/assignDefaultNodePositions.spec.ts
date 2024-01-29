/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Positioner, assignDefaultNodePositions } from '../assignDefaultNodePositions.js'
import { table } from 'arquero'

describe('graphs', () => {

	const NODE_COUNT = 10
	const empty = table({
		id: new Array(NODE_COUNT).fill(0).map((_, i) => i),
	})

	describe('assignDefaultNodePositions', () => {
		test('random defaults', async () => {
			const nodes = assignDefaultNodePositions(empty)
			expect(nodes.numRows()).toBe(NODE_COUNT)
			expect(nodes.column('x')).toBeDefined()
			expect(nodes.column('y')).toBeDefined()
		})
		test('grid', async () => {
			const nodes = assignDefaultNodePositions(empty, 'x', 'y', Positioner.Grid)
			nodes.print()
			expect(nodes.numRows()).toBe(NODE_COUNT)
			expect(nodes.column('x')).toBeDefined()
			expect(nodes.column('y')).toBeDefined()
		})
		
	})
})
