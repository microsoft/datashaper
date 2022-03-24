/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { run } from '../../engine/run.js'
import type { Step, Store } from '../../index.js'
import { Verb } from '../../index.js'
import { factory } from '../../steps/factory.js'
import { createTableStore } from '../../store/index.js'
import type { TableContainer } from '../../tables/index.js'

describe('run', () => {
	let store: Store<TableContainer>

	beforeEach(() => {
		store = createTableStore([
			{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) },
		])
	})

	test('runs a single step with normal input/output', async () => {
		const steps: Step[] = [
			factory(Verb.Fill, {
				to: 'filled',
				value: 1,
			}),
		]

		const result = await run(steps, store)
		expect(result.table?.numCols()).toBe(2)
		expect(result.table?.numRows()).toBe(4)
		expect(store.list()).toEqual(['input', 'output'])
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
