/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { container } from '../container.js'
import { DefaultTableStore } from '../DefaultTableStore.js'

const tick = () => new Promise(r => setTimeout(r, 0))

describe('DefaultTableStore', () => {
	test('empty constructor', () => {
		const store = new DefaultTableStore()
		expect(store.list()).toHaveLength(0)
	})

	test('created with tables', () => {
		const store = new DefaultTableStore([container('a', table({ id: [1] }))])
		expect(store.list()).toHaveLength(1)
	})

	test('get unregistered table fails', () => {
		const store = new DefaultTableStore()
		return expect(() => store.get('a')).rejects.toBeDefined()
	})

	test('get resolves table before returning', async () => {
		const store = new DefaultTableStore()
		store.setResolver('a', async () =>
			Promise.resolve(container('a', table({ id: [1] }))),
		)
		const result = await store.get('a')
		expect(result.table?.numCols()).toBe(1)
	})

	test('clone', async () => {
		const store = new DefaultTableStore([
			container('t1', table({ id: [1] })),
			container('t2', table({ name: ['hi'] })),
		])

		const clone = await store.clone()
		expect(store.list()).toEqual(clone.list())

		clone.delete('t1')

		expect(store.list()).toHaveLength(2)
		expect(clone.list()).toHaveLength(1)
	})

	describe('listeners', () => {
		test('listener fires for matched table id only', async () => {
			const store = new DefaultTableStore()
			const execs = { a: 0, b: 0 }

			store.onTableChange('a', () => execs.a++)
			store.onTableChange('b', () => execs.b++)
			store.set({ id: 'b' })

			await tick()
			expect(execs.a).toBe(0)
			expect(execs.b).toBe(1)
		})

		test('listener unlisten callback unregisters handler', async () => {
			const store = new DefaultTableStore()
			const execs = { a: 0, b: 0 }

			store.onTableChange('a', () => execs.a++)
			const unlisten = store.onTableChange('b', () => execs.b++)

			store.set({ id: 'a' })
			unlisten()

			store.set({ id: 'b' })

			// listeners can fire async
			await tick()
			expect(execs.a).toBe(1)
			expect(execs.b).toBe(0)
		})

		test('change listener fires for all tables', async () => {
			const store = new DefaultTableStore()
			let count = 0

			store.onChange(() => count++)
			store.set({ id: 'a' })
			store.set({ id: 'b' })
			store.set({ id: 'c' })

			await tick()
			expect(count).toBe(3)
		})

		test('multiple change listeners fire for all tables', async () => {
			const store = new DefaultTableStore()
			let count = 0

			store.onChange(() => count++)
			store.onChange(() => count++)

			store.set({ id: 'a' })
			store.set({ id: 'b' })

			await tick()
			expect(count).toBe(4)
		})
	})
})
