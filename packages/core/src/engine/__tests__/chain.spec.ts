/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { Verb, Step, StepType, TableStore, CompoundStep } from '../..'
import { chain } from '../verbs/chain'

describe('chain', () => {
	const input = table({
		ID: [1, 2, 3, 4],
	})

	let store: TableStore

	beforeEach(() => {
		store = new TableStore()
		store.set('input', input)
	})

	test('runs a single step with normal input/output', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output',
						args: {
							to: 'filled',
							value: 1,
						},
					},
				],
			},
		}

		return chain(step, store).then(result => {
			expect(result.numCols()).toBe(2)
			expect(result.numRows()).toBe(4)
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('default chain should not pollute the parent store with intermediate outputs', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output-1',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'output-1',
						output: 'output-2',
						args: {
							to: 'filled2',
							value: 2,
						},
					},
				],
			},
		}

		return chain(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('nofork chain does set all outputs in parent store', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output-1',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'output-1',
						output: 'output-2',
						args: {
							to: 'filled2',
							value: 2,
						},
					},
				],
			},
		}

		return chain(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			expect(store.list()).toEqual(['input', 'output'])
		})
	})

	test('chains run recursively', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
					{
						type: StepType.Verb,
						verb: Verb.Fill,
						input: 'input',
						output: 'output-1',
						args: {
							to: 'filled',
							value: 1,
						},
					},
					{
						type: StepType.Verb,
						verb: Verb.Chain,
						input: 'output-1',
						output: 'output-2',
						args: {
							steps: [
								{
									type: StepType.Verb,
									verb: Verb.Fill,
									input: 'output-1',
									output: 'output-2',
									args: {
										to: 'filled2',
										value: 2,
									},
								},
							],
						},
					} as CompoundStep,
				],
			},
		}

		return chain(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			// still no parent store pollution
			expect(store.list()).toEqual(['input', 'output'])
		})
	})
})
