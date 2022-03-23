/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { DefaultTableStore } from '../store/DefaultStore.js'

describe('DefaultTableStore', () => {
	test('empty constructor', () => {
		const store = new DefaultTableStore()
		expect(store.list()).toHaveLength(0)
	})

	test('created with tables', () => {
		const store = new DefaultTableStore([
			{
				id: 'a',
				table: table({
					id: [1],
				}),
			},
		])
		expect(store.list()).toHaveLength(1)
	})

	test('get unregistered table fails', () => {
		const store = new DefaultTableStore()
		return expect(() => store.get('a')).rejects.toBeDefined()
	})

	test('get resolves table before returning', () => {
		const store = new DefaultTableStore()
		store.queue('a', () => Promise.resolve(table({ id: [1] })))
		return store.get('a').then(result => {
			expect(result.table.numCols()).toBe(1)
		})
	})

	test('clone', () => {
		const store = new DefaultTableStore([
			{
				id: 't1',
				table: table({
					id: [1],
				}),
			},
			{
				id: 't2',
				table: table({
					name: ['hi'],
				}),
			},
		])

		return store.clone().then(clone => {
			expect(store.list()).toEqual(clone.list())

			clone.delete('t1')

			expect(store.list()).toHaveLength(2)
			expect(clone.list()).toHaveLength(1)
		})
	})

	describe('listeners', () => {
		test('listener fires for matched table id only', () => {
			const store = new DefaultTableStore()
			const execs = {
				a: 0,
				b: 0,
			}

			store.listen('a', () => execs.a++)
			store.listen('b', () => {
				execs.b++
			})

			store.set({
				id: 'b',
			})

			// listeners can fire async
			return Promise.resolve().then(() => {
				expect(execs.a).toBe(0)
				expect(execs.b).toBe(1)
			})
		})

		test('listener unlisten callback unregisters handler', () => {
			const store = new DefaultTableStore()
			const execs = {
				a: 0,
				b: 0,
			}

			store.listen('a', () => execs.a++)
			const unlisten = store.listen('b', () => execs.b++)

			store.set({
				id: 'a',
			})

			unlisten()

			store.set({
				id: 'b',
			})

			// listeners can fire async
			return Promise.resolve().then(() => {
				expect(execs.a).toBe(1)
				expect(execs.b).toBe(0)
			})
		})

		test('change listener fires for all tables', () => {
			const store = new DefaultTableStore()
			let count = 0

			store.addChangeListener(() => count++)

			store.set({
				id: 'a',
			})

			store.set({
				id: 'b',
			})

			store.set({
				id: 'c',
			})

			return Promise.resolve().then(() => {
				expect(count).toBe(3)
			})
		})

		test('multiple change listeners fire for all tables', () => {
			const store = new DefaultTableStore()
			let count = 0

			store.addChangeListener(() => count++)
			store.addChangeListener(() => count++)

			store.set({
				id: 'a',
			})

			store.set({
				id: 'b',
			})

			return Promise.resolve().then(() => {
				expect(count).toBe(4)
			})
		})
	})
})
