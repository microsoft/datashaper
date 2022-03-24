/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { lookup, LookupInput } from '../lookup.js'
import { staticValueNode } from '../util/factories/index.js'
import { TestStore } from './TestStore.js'

describe('test for lookup verb', () => {
	let store: TestStore
	beforeEach(() => {
		store = new TestStore()
	})

	test('lookup test', () => {
		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table5')!)

		const node = lookup('output')
		node.bind({ input: LookupInput.Input, node: table1 })
		node.bind({ input: LookupInput.Other, node: table2 })
		node.config = { on: ['ID'], columns: ['item'] }

		const result = node.outputValue()

		expect(result?.table?.numCols()).toBe(4)
		expect(result?.table?.numRows()).toBe(5)
	})
})
