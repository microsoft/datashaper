/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { DefaultTableStore } from '../DefaultTableStore'

describe('DefaultTableStore', () => {
	test('clone', () => {
		const t1 = table({
			ID: [1, 2, 3, 4],
		})
		const t2 = table({
			name: ['hi', 'bye'],
		})

		const store = new DefaultTableStore([
			{ id: 't1', table: t1 },
			{ id: 't2', table: t2 },
		])

		return store.clone().then(clone => {
			expect(store.list()).toEqual(clone.list())

			clone.delete('t1')

			expect(store.list()).toHaveLength(2)
			expect(clone.list()).toHaveLength(1)
		})
	})
})
