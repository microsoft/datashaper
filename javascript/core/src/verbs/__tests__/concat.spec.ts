/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { observableNode } from '../../graph/index.js'
import { concat } from '../concat.js'

describe('test for concat verb', () => {
	test('concat test', () => {
		const store = new TestStore()

		const table1 = observableNode('input', store.observe('table1')!)
		const table2 = observableNode('input', store.observe('table2')!)

		expect(table1.outputValue()).toBeDefined()
		expect(table2.outputValue()).toBeDefined()

		const node = concat('output')
		node.bind({ node: table1 })
		node.bindVariadic([{ node: table2 }])

		const result = node.outputValue()

		// no change to column count
		expect(result?.table?.numCols()).toBe(3)
		// combined rows of 5 + 1
		expect(result?.table?.numRows()).toBe(6)
		expect(result?.table?.get('count', 0)).toBe(10)
		expect(result?.table?.get('count', 1)).toBe(20)
		expect(result?.table?.get('count', 2)).toBe(30)
		expect(result?.table?.get('count', 3)).toBe(40)
		expect(result?.table?.get('count', 4)).toBe(50)
		expect(result?.table?.get('count', 5)).toBe(60)
	})
})
