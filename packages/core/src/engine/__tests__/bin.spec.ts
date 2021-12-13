/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { BinStrategy } from '../..'
import { Step, StepType, Verb } from '../../types'
import { bin } from '../verbs/bin'
import { TestStore } from './TestStore'

describe('test for bin verb', () => {
	test('BinStrategy.FixedCount', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Bin,
			input: 'table9',
			output: 'output',
			args: {
				as: 'newColumn',
				field: 'count',
				strategy: BinStrategy.FixedCount,
				fixedcount: 5,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			expect(b).toHaveLength(6)
			expect(b[0]).toBe(10)
			expect(b[1]).toBe(48)
			expect(b[5]).toBe(200)
		})
	})

	test('BinStrategy.FixedWidth', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Bin,
			input: 'table9',
			output: 'output',
			args: {
				as: 'newColumn',
				field: 'count',
				strategy: BinStrategy.FixedWidth,
				fixedwidth: 30,
			},
		}

		const store = new TestStore()

		return bin(step, store).then(result => {
			const b = bins(result)
			expect(b).toHaveLength(7)
			expect(b[0]).toBe(10)
			expect(b[1]).toBe(40)
		})
	})
})

function bins(table: ColumnTable) {
	const objects = table.objects()
	const values = objects.reduce((acc, cur) => {
		acc[cur.newColumn] = +cur.newColumn
		return acc
	}, {})
	return Object.values(values)
}
