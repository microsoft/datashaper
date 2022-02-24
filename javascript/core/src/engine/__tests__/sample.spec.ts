/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb } from '../../types.js'
import { sample } from '../verbs/sample.js'
import { TestStore } from './TestStore.js'

describe('test for sample verb', () => {
	test('sample test with percentage', () => {
		const step: Step = {
			verb: Verb.Sample,
			input: 'table6',
			output: 'output',
			args: {
				proportion: 0.4,
			},
		}

		const store = new TestStore()

		return sample(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(2)
		})
	})

	test('sample test with size', () => {
		const step: Step = {
			verb: Verb.Sample,
			input: 'table6',
			output: 'output',
			args: {
				size: 4,
			},
		}

		const store = new TestStore()

		return sample(step, store).then(result => {
			expect(result.table.numCols()).toBe(3)
			expect(result.table.numRows()).toBe(4)
		})
	})
})
