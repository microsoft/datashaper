import { Verb } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { table } from 'arquero'

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
			input: ['input'],
			steps: [
				{
					verb: Verb.Fill,
					args: {
						to: 'filled',
						value: 1,
					},
					input: 'input',
				},
			],
		})
		g.addInputTables([{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }])

		expect(g).toBeDefined()
		const result = g.read()
		expect(result?.table).toBeDefined()
		expect(result?.table?.numCols()).toBe(2)
		expect(result?.table?.numRows()).toBe(4)
	})

	test('runs a single step with named output', () => {
		const g = new Workflow({
			name: 'test',
			input: ['input'],
			steps: [
				{
					id: 'filled',
					verb: Verb.Fill,
					args: {
						to: 'filled',
						value: 1,
					},
					input: 'input',
				},
			],
		})
		g.addInputTables([{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }])
		g.addOutput('filled')

		expect(g).toBeDefined()

		// read default output
		const defaultOut = g.read()
		expect(defaultOut?.id).toBe('test')
		expect(defaultOut?.table?.numCols()).toBe(2)
		expect(defaultOut?.table?.numRows()).toBe(4)

		// read named output
		const namedOut = g.read('filled')
		expect(namedOut?.id).toBe('filled')
		expect(namedOut).toBeDefined()
		expect(namedOut?.table?.numCols()).toBe(2)
		expect(namedOut?.table?.numRows()).toBe(4)
	})

	test('runs multiple steps with normal input/output and all intermediates', () => {
		const g = new Workflow({
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
					verb: Verb.Fill,
					args: {
						to: 'filled2',
						value: 2,
					},
				},
			],
		})
		g.addInputTables([{ id: 'input', table: table({ ID: [1, 2, 3, 4] }) }])

		expect(g).toBeDefined()
		const result = g.read()
		expect(result).toBeDefined()
		expect(result?.table).toBeDefined()
		expect(result?.table?.numCols()).toBe(3)
		expect(result?.table?.numRows()).toBe(4)
		expect(result?.table?.columnNames()).toEqual(['ID', 'filled', 'filled2'])
	})

	it('will pipe through default input of no steps are defined', () => {
		const wf = new Workflow()
		wf.input = tInput
		const output = wf.read()
		expect(output).toBeDefined()
		expect(output?.table).toBeDefined()
		expect(output?.table?.column('id')).toBeDefined()
		expect(output?.table?.column('price')).toBeDefined()
	})

	it('can be constructed iteratively with addStep', () => {
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
		wf.input = tInput
		const output = wf.read()
		expect(output).toBeDefined()
		expect(output?.table).toBeDefined()
	})

	it('can read intermediate steps, (with early read)', () => {
		const wf = new Workflow()
		const binRead = wf.read$('intermediate')
		wf.addStep({
			verb: Verb.Bin,
			id: 'intermediate',
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
		wf.addOutput('intermediate')
		wf.input = tInput
		let val: TableContainer | undefined
		binRead.subscribe((v) => {
			val = v
		})
		expect(val).toBeDefined()

		// doesn't blow up
		wf.dispose()
	})

	it('can read intermediate steps', () => {
		const wf = new Workflow()
		wf.name = 'test_workflow'
		wf.addStep({
			verb: Verb.Bin,
			id: 'intermediate',
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
		wf.input = tInput

		wf.addOutput('intermediate')
		const intermediateRead = wf.read$('intermediate')
		let val: TableContainer | undefined
		intermediateRead.subscribe((v) => {
			val = v
		})
		expect(val).toBeDefined()
		expect(val?.id).toBe('intermediate')

		expect(wf.outputNames).toHaveLength(1)
		expect(wf.outputNames[0]).toBe('intermediate')

		// default table + intermediate
		expect(wf.toArray()).toHaveLength(1)
		expect(
			wf
				.toArray({
					includeDefaultInput: true,
					includeInputs: true,
					includeDefaultOutput: true,
				})
				.map((t) => t?.id),
		).toHaveLength(3)
		expect(wf.toArray()).toHaveLength(1)
		expect(
			wf.toArray({
				includeDefaultInput: true,
				includeInputs: true,
				includeDefaultOutput: true,
			}),
		).toHaveLength(3)
	})

	it('emits a default tablecontainer with id = name', () => {
		const wf = new Workflow()
		wf.name = 'wf_output'
		wf.input = tInput

		const table = wf.read()
		expect(table?.id).toBe('wf_output')
	})
})
