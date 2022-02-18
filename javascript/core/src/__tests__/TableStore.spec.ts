/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { TableStore } from '../TableStore'

describe('TableStore', () => {
	test('clone', () => {
		const store = new TableStore()
		const t1 = table({
			ID: [1, 2, 3, 4],
		})
		const t2 = table({
			name: ['hi', 'bye'],
		})

		store.set('t1', t1)
		store.set('t2', t2)

		const clone = store.clone()

		expect(store.list()).toEqual(clone.list())

		clone.delete('t1')

		expect(store.list()).toHaveLength(2)
		expect(clone.list()).toHaveLength(1)
	})
})
