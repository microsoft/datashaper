/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { Verb } from '@datashaper/schema'
import { table } from 'arquero'

import { createTableStore } from '../../__tests__/createTableStore.js'
import { Workflow } from '../../engine/Workflow.js'
import { createGraph } from '../graph.js'

describe('stepGraph', () => {
	let store: Map<string, TableContainer>

	beforeEach(() => {
		store = createTableStore([
			{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) },
		])
	})

	test('runs a single step with normal input/output', () => {
		const g = createGraph(
			new Workflow(
				{
					$schema:
						'https://microsoft.github.io/datashaper/schema/workflow/workflow.json',
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
				false,
			),
			store,
		)
		expect(g).toBeDefined()
		const result = g.latest('output')
		expect(result?.table?.numCols()).toBe(2)
		expect(result?.table?.numRows()).toBe(4)
		expect(g.outputs).toEqual(['output'])
	})

	test('runs multiple steps with normal input/output and all intermediates', () => {
		const g = createGraph(
			new Workflow(
				{
					$schema:
						'https://microsoft.github.io/datashaper/schema/workflow/workflow.json',
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
				false,
			),
			store,
		)
		expect(g).toBeDefined()
		const result = g.latest('output-2')
		expect(result).toBeDefined()
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(4)
		expect(result?.table?.columnNames()).toEqual(['ID', 'filled', 'filled2'])
		expect(g.outputs).toEqual(['output-1', 'output-2'])
	})
})
