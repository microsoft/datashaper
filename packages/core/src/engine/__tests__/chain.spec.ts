/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { Verb, Step, TableStore } from '../../index.js'
import { chain } from '../verbs/chain.js'

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
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
					{
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
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
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
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				nofork: true,
				steps: [
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
				],
			},
		}

		return chain(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(4)
			expect(result.columnNames()).toEqual(['ID', 'filled', 'filled2'])
			// note the child chain outputs get inserted before the final output due to the depth-first recursion
			expect(store.list()).toEqual(['input', 'output-1', 'output-2', 'output'])
		})
	})

	test('chains run recursively', () => {
		const step: Step = {
			verb: Verb.Chain,
			input: 'input',
			output: 'output',
			args: {
				steps: [
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
						verb: Verb.Chain,
						input: 'output-1',
						output: 'output-2',
						args: {
							steps: [
								{
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
					},
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
