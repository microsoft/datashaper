/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { difference } from '../setVerbs.js'
import { staticValueNode } from '../util/factories/index.js'
import { NodeInput } from '../util/factories/types.js'
import { TestStore } from './TestStore.js'

describe('test for difference verb', () => {
	test('difference test with no duplicates', () => {
		const store = new TestStore()

		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table2')!)

		expect(table1.outputValue()).toBeDefined()
		expect(table2.outputValue()).toBeDefined()

		const node = difference('output')
		node.bind({ input: NodeInput.Source, node: table1 })
		node.bindNext({ node: table2 })

		const result = node.outputValue()

		// no dups in table2, so output should match original
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(5)
	})
})
