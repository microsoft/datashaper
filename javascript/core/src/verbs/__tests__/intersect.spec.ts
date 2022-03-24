/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TestStore } from '../../__tests__/TestStore.js'
import { intersect } from '../setVerbs.js'
import { observableNode } from '../factories/index.js'
import { NodeInput } from '../factories/types.js'

describe('test for intersect verb', () => {
	test('intersect test with no duplicates', () => {
		const store = new TestStore()

		const table1 = observableNode('input', store.observe('table4')!)
		const table2 = observableNode('input', store.observe('table5')!)

		expect(table1.outputValue()).toBeDefined()
		expect(table2.outputValue()).toBeDefined()

		const node = intersect('output')
		node.bind({ input: NodeInput.Source, node: table1 })
		node.bindNext({ node: table2 })

		const result = node.outputValue()
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(4)
		expect(result?.table?.get('ID', 0)).toBe(1)
		expect(result?.table?.get('ID', 1)).toBe(2)
		expect(result?.table?.get('ID', 2)).toBe(4)
		expect(result?.table?.get('ID', 3)).toBe(4)
	})
})
