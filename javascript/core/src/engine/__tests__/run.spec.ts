/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'

import { Verb } from '../../index.js'
import { step } from '../../steps/step.js'
import type { Step } from '../../steps/index.js'
import { createTableStore } from '../../store/index.js'
import type { Store } from '../../store/types.js'
import type { TableContainer } from '../../tables/index.js'
import { run } from '../run.js'

describe('run', () => {
	let store: Store<TableContainer>

	beforeEach(() => {
		store = createTableStore([
			{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) },
		])
	})

	test('runs a single step with normal input/output', async () => {
		const steps: Step[] = [
			step(Verb.Fill, {
				to: 'filled',
				value: 1,
			}),
		]

		const result = await run(steps, store)
		expect(result.table?.numCols()).toBe(2)
		expect(result.table?.numRows()).toBe(4)
		expect(store.list()).toEqual(['input', 'output'])
	})

	test('runs multiple steps with normal input/output and all intermediates', async () => {
		const steps: Step[] = [
			{
				id: 'output-1',
				verb: Verb.Fill,
				inputs: {
					source: { node: 'table1' },
				},
				args: {
					to: 'filled',
					value: 1,
				},
			},
			{
				id: 'output-2',
				verb: Verb.Fill,
				inputs: {
					source: { node: 'output-1' },
				},
				args: {
					to: 'filled2',
					value: 2,
				},
			},
		]

		const result = await run(steps, store)
		expect(result.table?.numCols()).toBe(3)
		expect(result.table?.numRows()).toBe(4)
		expect(result.table?.columnNames()).toEqual(['ID', 'filled', 'filled2'])
		expect(store.list()).toEqual(['input', 'output-1', 'output-2'])
	})
})
