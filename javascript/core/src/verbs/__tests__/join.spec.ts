/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join, JoinInput } from '../join.js'
import { JoinStrategy } from '../types/index.js'
import { staticValueNode } from '../util/factories/index.js'
import { TestStore } from './TestStore.js'

describe('test for join verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('inner (default)', () => {
		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table5')!)

		const node = join('output')
		node.bind({ input: JoinInput.Left, node: table1 })
		node.bind({ input: JoinInput.Right, node: table2 })
		node.config = { on: ['ID'] }

		const result = node.outputValue()

		// ID 3 & 5 in the input do not have a match, so will be removed in default inner join
		expect(result?.table?.numCols()).toBe(5)
		expect(result?.table?.numRows()).toBe(6)
	})

	test('left (outer)', () => {
		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table5')!)

		const node = join('output')
		node.bind({ input: JoinInput.Left, node: table1 })
		node.bind({ input: JoinInput.Right, node: table2 })
		node.config = { on: ['ID'], strategy: JoinStrategy.LeftOuter }

		const result = node.outputValue()

		// ID 3 & 5 in the input do not have a match, but will be preserved with left join
		expect(result?.table?.numCols()).toBe(5)
		expect(result?.table?.numRows()).toBe(8)
	})

	test('right (outer)', () => {
		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table8')!)

		const node = join('output')
		node.bind({ input: JoinInput.Left, node: table1 })
		node.bind({ input: JoinInput.Right, node: table2 })
		node.config = { on: ['ID'], strategy: JoinStrategy.RightOuter }
		const result = node.outputValue()

		// ID 6, 7, 8 in the other do not have a match, but will be preserved
		expect(result?.table?.numCols()).toBe(5)
		expect(result?.table?.numRows()).toBe(5)
	})

	test('full (outer)', () => {
		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table8')!)

		const node = join('output')
		node.bind({ input: JoinInput.Left, node: table1 })
		node.bind({ input: JoinInput.Right, node: table2 })
		node.config = { on: ['ID'], strategy: JoinStrategy.FullOuter }
		const result = node.outputValue()

		// ID 1, 2, 3 on input and 6, 7, 8 have no matches
		// but all rows will be preserved in a full outer join
		expect(result?.table?.numCols()).toBe(5)
		expect(result?.table?.numRows()).toBe(8)
	})
})
