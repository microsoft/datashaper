/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { fold } from '../verbs/fold'
import { pivot } from '../verbs/pivot'
import { TestStore } from './TestStore'

describe('test for pivot verb', () => {
	test('pivot test after fold with one column', async () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Fold,
			input: 'table1',
			output: 'output',
			args: { to: ['key', 'value'], columns: ['ID', 'name', 'count'] },
		}

		const store = new TestStore()

		await fold(step, store).then(result => {
			store.set('newTable', result)
		})

		const step2: Step = {
			type: StepType.Verb,
			verb: Verb.Pivot,
			input: 'newTable',
			output: 'output',
			args: {
				columns: ['key'],
			},
		}

		return pivot(step2, store).then(result => {
			result.print()
		})
	})
})
