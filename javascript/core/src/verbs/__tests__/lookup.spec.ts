/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { observableNode } from '../../graph/index.js'
import { lookup } from '../lookup.js'
import { NodeInput } from '../types.js'

describe('test for lookup verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('lookup test', () => {
		const table1 = observableNode('input', store.observe('table1')!)
		const table2 = observableNode('input', store.observe('table5')!)

		const node = lookup('output')
		node.bind({  node: table1 })
		node.bind({ input: NodeInput.Other, node: table2 })
		node.config = { on: ['ID'], columns: ['item'] }

		const result = node.outputValue()

		expect(result?.table?.numCols()).toBe(4)
		expect(result?.table?.numRows()).toBe(5)
	})
})
