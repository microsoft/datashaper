/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { DefaultTableStore } from '../../DefaultTableStore.js'
import type { Step, TableStore } from '../../index.js'
import { Verb } from '../../index.js'
import { run } from '../run.js'

describe('run', () => {
	const input = table({
		ID: [1, 2, 3, 4],
	})

	let store: TableStore

	beforeEach(() => {
		store = new DefaultTableStore([{ id: 'input', table: input }])
	})

	test('runs a single step with normal input/output', () => {
		const steps: Step[] = [
			{
				verb: Verb.Fill,
				input: 'input',
				output: 'output',
				args: {
					to: 'filled',
					value: 1,
				},
			},
		]

		return run(steps, store).then(result => {
			expect(result.table.numCols()).toBe(2)
			expect(result.table.numRows()).toBe(4)
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('runs multiple steps with normal input/output and all intermediates', () => {
		const steps: Step[] = [
			{
				verb: Verb.Fill,
				input: 'input',
				output: 'output-1',
				args: {
					to: 'filled',
					value: 1,
				},
			},
			{
				verb: Verb.Fill,
				input: 'output-1',
				output: 'output-2',
				args: {
					to: 'filled2',
					value: 2,
				},
			},
		]

		return run(steps, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(4)
			expect(result.table.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output-1', 'output-2'])
		})
	})
})
