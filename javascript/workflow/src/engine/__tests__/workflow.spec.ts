/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { table } from 'arquero'

import { createWorkflow } from '../createWorkflow.js'

describe('stepGraph', () => {
	let store: TableContainer[]

	beforeEach(() => {
		store = [{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }]
	})

	test('runs a single step with normal input/output', () => {
		const g = createWorkflow(
			{
				id: 'test workflow',
				$schema:
					'https://microsoft.github.io/datashaper/schema/workflow/workflow.json',
				name: 'test',
				input: ['input'],
				steps: [
					{
						id: 'fill1',
						verb: Verb.Fill,
						args: {
							to: 'filled',
							value: 1,
						},
						input: 'input',
					},
				],
				output: [{ name: 'output', node: 'fill1' }],
			},
			store,
		)
		expect(g).toBeDefined()
		const result = g.read('output')
		expect(result?.table?.numCols()).toBe(2)
		expect(result?.table?.numRows()).toBe(4)
		expect(g.outputNames).toEqual(['output'])
	})

	test('runs multiple steps with normal input/output and all intermediates', () => {
		const g = createWorkflow(
			{
				id: 'test workflow',
				$schema:
					'https://microsoft.github.io/datashaper/schema/workflow/workflow.json',
				name: 'test',
				input: ['input'],
				steps: [
					{
						id: 'output-1',
						verb: Verb.Fill,
						input: 'input',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						id: 'output-2',
						verb: Verb.Fill,
						args: {
							to: 'filled2',
							value: 2,
						},
					},
				],
				output: ['output-1', 'output-2'],
			},

			store,
		)
		expect(g).toBeDefined()
		const result = g.read('output-2')
		expect(result).toBeDefined()
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(4)
		expect(result?.table?.columnNames()).toEqual(['ID', 'filled', 'filled2'])
		expect(g.outputNames).toEqual(['output-1', 'output-2'])
	})
})
