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
