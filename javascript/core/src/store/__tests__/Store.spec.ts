/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { from } from 'rxjs'

import { tick } from '../../__tests__/utils.js'
import { container } from '../../tables/container.js'
import { createTableStore } from '../createTableStore.js'

describe('DefaultTableStore', () => {
	test('empty constructor', () => {
		const store = createTableStore()
		expect(store.list()).toHaveLength(0)
	})

	test('created with tables', () => {
		const store = createTableStore([container('a', table({ id: [1] }))])
		expect(store.list()).toHaveLength(1)
	})

	test('get unregistered table fails', () => {
		const store = createTableStore()
		return expect(() => store.get('a')).toThrow('table "a" not defined')
	})

	test('get resolves table before returning', () => {
		const store = createTableStore()
		store.set('a', from([container('a', table({ id: [1] }))]))
		const result = store.get('a')
		expect(result?.table?.numCols()).toBe(1)
	})

	describe('listeners', () => {
		test('listener fires for matched table id only', async () => {
			const store = createTableStore()
			const execs = { a: 0, b: 0 }

			store.onItemChange('a', () => execs.a++)
			store.onItemChange('b', () => execs.b++)
			store.set('b', from([{ id: 'b' }]))

			await tick()
			expect(execs.a).toBe(0)
			expect(execs.b).toBe(1)
		})

		test('listener unlisten callback unregisters handler', async () => {
			const store = createTableStore()
			const execs = { a: 0, b: 0 }

			store.onItemChange('a', () => execs.a++)
			const unlisten = store.onItemChange('b', () => execs.b++)

			store.set('a', from([{ id: 'a' }]))
			unlisten()
			store.set('b', from([{ id: 'b' }]))

			// listeners can fire async
			await tick()
			expect(execs.a).toBe(1)
			expect(execs.b).toBe(0)
		})

		test('change listener fires for all tables', async () => {
			const store = createTableStore()
			let count = 0

			store.onChange(() => count++)
			store.set('a', from([{ id: 'a' }]))
			store.set('b', from([{ id: 'b' }]))
			store.set('c', from([{ id: 'c' }]))

			await tick()
			expect(count).toBe(3)
		})

		test('multiple change listeners fire for all tables', async () => {
			const store = createTableStore()
			let count = 0

			store.onChange(() => count++)
			store.onChange(() => count++)

			store.set('a', from([{ id: 'a' }]))
			store.set('b', from([{ id: 'b' }]))

			await tick()
			expect(count).toBe(4)
		})
	})
})
