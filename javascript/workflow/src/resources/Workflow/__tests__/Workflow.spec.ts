import { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { table } from 'arquero'
import { from } from 'rxjs'

import { Workflow } from '../Workflow.js'

describe('The Workflow Resource', () => {
	let tInput: TableContainer | undefined
	beforeAll(() => {
		tInput = {
			id: 'input',
			table: table({
				id: [1, 2, 3, 4, 5],
				price: [140, 25, 30, 40, 500],
			}),
		}
	})

	test('runs a single step with normal input/output', () => {
		const g = new Workflow({
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
		})
		g.addInputTables([{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }])

		expect(g).toBeDefined()
		const result = g.read('output')
		expect(result?.table?.numCols()).toBe(2)
		expect(result?.table?.numRows()).toBe(4)
		expect(g.outputNames).toEqual(['output'])
	})

	test('runs multiple steps with normal input/output and all intermediates', () => {
		const g = new Workflow({
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
		})
		g.addInputTables([{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }])
		expect(g).toBeDefined()
		const result = g.read('output-2')
		expect(result).toBeDefined()
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(4)
		expect(result?.table?.columnNames()).toEqual(['ID', 'filled', 'filled2'])
		expect(g.outputNames).toEqual(['output-1', 'output-2'])
	})

	it('will pipe through default input of no steps are defined', () => {
		const wf = new Workflow()
		wf.defaultInput = from([tInput])
		const output = wf.read()
		expect(output).toBeDefined()
		expect(output?.table).toBeDefined()
		expect(output?.table?.column('id')).toBeDefined()
		expect(output?.table?.column('price')).toBeDefined()
	})

	it('can process a basic workflow', () => {
		const wf = new Workflow()
		wf.addStep({
			verb: Verb.Bin,
			id: 'bin-1',
			args: {
				column: 'price',
				to: 'price_bin',
				fixedcount: 4,
				min: 25,
				max: 500,
			},
		})
		wf.addStep({
			verb: Verb.Fill,
			args: {
				to: 'derp',
				value: 'x',
			},
		})
		wf.defaultInput = from([tInput])
		const output = wf.read()
		expect(output).toBeDefined()
		expect(output?.table).toBeDefined()
	})

	it('can read intermediate steps', () => {
		const wf = new Workflow()
		wf.addStep({
			verb: Verb.Bin,
			id: 'bin-1',
			args: {
				column: 'price',
				to: 'price_bin',
				fixedcount: 4,
				min: 25,
				max: 500,
			},
		})
		wf.addStep({
			verb: Verb.Fill,
			args: {
				to: 'derp',
				value: 'x',
			},
		})
		wf.addOutput({ name: 'intermediate', node: 'bin-1' })
		const binRead = wf.read$('intermediate')
		wf.defaultInput = from([tInput])
		let val: TableContainer | undefined
		binRead.subscribe(v => (val = v))
		expect(val).toBeDefined()
	})

	it('can read intermediate steps, (with early read)', () => {
		const wf = new Workflow()
		const binRead = wf.read$('intermediate')
		wf.addStep({
			verb: Verb.Bin,
			id: 'bin-1',
			args: {
				column: 'price',
				to: 'price_bin',
				fixedcount: 4,
				min: 25,
				max: 500,
			},
		})
		wf.addStep({
			verb: Verb.Fill,
			args: {
				to: 'derp',
				value: 'x',
			},
		})
		wf.addOutput({ name: 'intermediate', node: 'bin-1' })
		wf.defaultInput = from([tInput])
		let val: TableContainer | undefined
		binRead.subscribe(v => (val = v))
		expect(val).toBeDefined()

		// doesn't blow up
		wf.dispose()
	})
})
