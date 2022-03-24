/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { union } from '../setVerbs.js'
import { staticValueNode } from '../util/factories/index.js'
import { NodeInput } from '../util/factories/types.js'
import { TestStore } from './TestStore.js'

describe('test for union verb', () => {
	test('union test', () => {
		const store = new TestStore()

		const table1 = staticValueNode('input', store.get('table1')!)
		const table2 = staticValueNode('input', store.get('table2')!)

		expect(table1.outputValue()).toBeDefined()
		expect(table2.outputValue()).toBeDefined()

		const node = union('output')
		node.bind({ input: NodeInput.Source, node: table1 })
		node.bindNext({ node: table2 })

		const result = node.outputValue()

		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(6)
		expect(result?.table?.get('ID', 0)).toBe(1)
	})
})
