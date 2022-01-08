/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { MathOperator, Step, StepType } from '../..'
import { runPipeline } from '../runPipeline'

describe('runPipeline', () => {
	const tbl = table({
		ID: [1, 2, 3, 4],
	})

	test('runs a single step with normal input/output', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: 'fill',
			input: 'input',
			output: 'output',
			args: {
				as: 'filled',
				value: 1,
			},
		}
		return runPipeline(tbl, step).then(result => {
			expect(result.numCols()).toBe(2)
		})
	})

	test('runs a single step with empty input/output', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: 'fill',
			// these are required on the type but can be empty strings
			input: '',
			output: '',
			args: {
				as: 'filled',
				value: 1,
			},
		}
		return runPipeline(tbl, step).then(result => {
			expect(result.numCols()).toBe(2)
		})
	})

	test('runs a set of steps with normal input/output', () => {
		const step: Step[] = [
			{
				type: StepType.Verb,
				verb: 'fill',
				input: 'input',
				output: 'output1',
				args: {
					as: 'filled',
					value: 1,
				},
			},
			{
				type: StepType.Verb,
				verb: 'derive',
				input: 'output1',
				output: 'output2',
				args: {
					as: 'derived',
					column1: 'ID',
					column2: 'filled',
					operator: MathOperator.Add,
				},
			},
		]
		return runPipeline(tbl, step).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.get('derived', 0)).toBe(2)
		})
	})

	test('runs a set of steps with no input/output', () => {
		const step: Step[] = [
			{
				type: StepType.Verb,
				verb: 'fill',
				input: '',
				output: '',
				args: {
					as: 'filled',
					value: 1,
				},
			},
			{
				type: StepType.Verb,
				verb: 'derive',
				input: '',
				output: '',
				args: {
					as: 'derived',
					column1: 'ID',
					column2: 'filled',
					operator: MathOperator.Add,
				},
			},
			{
				type: StepType.Verb,
				verb: 'select',
				input: '',
				output: '',
				args: {
					as: 'output',
					columns: {
						derived: 'derived',
					},
				},
			},
		]
		return runPipeline(tbl, step).then(result => {
			expect(result.numCols()).toBe(1)
			expect(result.get('derived', 0)).toBe(2)
		})
	})
})
