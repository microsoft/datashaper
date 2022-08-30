/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * This is a store implementation pre-loaded with test tables to ease setup.
 */
export class TestStore {
	constructor(private _defaultTableName: string = 'table1') {
		const table1 = table({
			ID: [1, 2, 3, 4, 5],
			name: ['A', 'B', 'C', 'D', 'E'],
			count: [10, 20, 30, 40, 50],
		})
		const table2 = table({
			ID: [6],
			name: ['F'],
			count: [60],
		})
		const table3 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', 'pillow', 'sofa', 'sofa', 'chair', 'stool'],
		})
		const table4 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', 'pillow', 'sofa', 'sofa', 'chair', 'stool'],
			quantity: [45, 78, 100, 89, 50, 45],
		})

		const table5 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', null, 'sofa', 'sofa', 'chair', null],
			quantity: [45, 78, 100, 89, 50, 45],
		})

		const table6 = table({
			ID: [1, 2, 3, 4, 5, 6],
			FY20: [10000, 56000, 45000, 5000, 8900, 90000],
			FY21: [5000, 4000, 45000, 6000, 9000, 78000],
		})

		const table7 = table({
			ID: [1, 2, 3, 4, 5],
			item: ['bed', 'pillow', 'sofa', 'chair', 'stool'],
			quantity: [45, 78, 100, 89, 50],
			totalSale: [54000, 7800, 230000, 20470, 5000],
		})

		const table8 = table({
			ID: [4, 5, 6, 7, 8],
			name: ['D', 'E', 'F', 'G', 'H'],
			count: [80, 90, 100, 110, 120],
		})

		const table9 = table({
			count: [
				10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
				170, 180, 190, 200,
			],
		})

		const table10 = table({
			x: ['A', 'B', 'A'],
			y: [1, 2, 1],
			z: [4, 5, 4],
		})

		const table11 = table({
			x: ['A', 'B', 'A'],
			y: [1, null, 1],
			z: [4, 5, 4],
		})

		const table12 = table({
			ID: [1, 2, 3, 4, 5],
			item: ['bed', 'pillow', null, 'chair', 'stool'],
			quantity: [45, null, 100, 89, 50],
			totalSale: [54000, 7800, 230000, 20470, 5000],
		})

		const table13 = table({
			ID: [1, 2, 3, 4, 5],
			name: ['A', 'B', 'C', 'D', 'E'],
			description: ['XX', 'XT', 'QW', 'RE', 'FG'],
		})

		const table14 = table({
			x: ['A', 'B', 'A'],
			y: [1, null, 1],
			z: [true, false, false],
		})

		const table15 = table({
			x: ['A', 'B', 'A'],
			y: [null, true, false],
			z: [true, false, true],
		})

		const table16 = table({
			key: ['A', 'B', 'C'],
			value: [1, 2, 3],
		})

		const table17 = table({
			type: [1, 1, 1, 2, 2],
			name: ['A', 'A', 'B', 'A', 'B'],
			count: [1, 2, 3, 4, 5],
		})

		const table18 = table({
			A: [1, 3, 10],
			B: [2, 4, 20],
			C: [3, 5, 30],
		})

		const table19 = table({
			int: ['1', '-12', '40098', 'F98'],
			int_hex: ['0x000000', '0xffffff', '0x0000ff', '0xkl0922'],
			date: [
				'2021-04-13',
				'2001-08-18T00:00:00Z',
				'1998-01-12T04:38:00Z',
				'date',
			],
			decimal: ['1.232', '39488.45', '0.9989', 'g19.2'],
			boolean: ['true', 'false', 'hi', ''],
		})

		// matrix of binary combinations for testing boolean logic
		const table20 = table({
			A: [1, 1, 1, 0],
			B: [1, 1, 0, 0],
			C: [1, 0, 0, 0],
			D: [1, 0, 0, 0],
		})

		const table21 = table({
			date: [
				new Date(1994, 2, 24),
				new Date(2020, 5, 23),
				new Date(2022, 2, 28),
			],
		})

		const table22 = table({
			ID: [1, 2, 3, 4, 5],
			value: [12.35, 86.55, 45.55, 66.35, 78.25],
		})

		const table23 = table({
			ID: [1, 2, 3, 4, 5],
			date: [
				'2021-04-13',
				'2021-12-05',
				'1998-01-12T04:38:00Z',
				'1996-01-01',
				null,
			],
		})

		const table24 = table({
			ID: [1, 2, 3],
			date: [
				new Date(1994, 2, 24).getTime(),
				new Date(2020, 5, 23).getTime(),
				new Date(2022, 2, 28).getTime(),
			],
		})

		const table25 = table({
			ID: [1, 2, 3, 4, 5],
			date: [
				'2021-04-13',
				'2021-12-05',
				'1998-01-12T04:38:00Z',
				'null',
				'undefined',
			],
		})

		const table26 = table({
			ID: [1, 2, 3, 4, 5],
			values: ['undefined', 'test1', 'null', 'test2', 'final test'],
		})

		this.set('table1', { id: 'table1', table: table1 })
		this.set('table2', { id: 'table2', table: table2 })
		this.set('table3', { id: 'table3', table: table3 })
		this.set('table4', { id: 'table4', table: table4 })
		this.set('table5', { id: 'table5', table: table5 })
		this.set('table6', { id: 'table6', table: table6 })
		this.set('table7', { id: 'table7', table: table7 })
		this.set('table8', { id: 'table8', table: table8 })
		this.set('table9', { id: 'table9', table: table9 })
		this.set('table10', { id: 'table10', table: table10 })
		this.set('table11', { id: 'table11', table: table11 })
		this.set('table12', { id: 'table12', table: table12 })
		this.set('table13', { id: 'table13', table: table13 })
		this.set('table14', { id: 'table14', table: table14 })
		this.set('table15', { id: 'table15', table: table15 })
		this.set('table16', { id: 'table16', table: table16 })
		this.set('table17', { id: 'table17', table: table17 })
		this.set('table18', { id: 'table18', table: table18 })
		this.set('table19', { id: 'table19', table: table19 })
		this.set('table20', { id: 'table20', table: table20 })
		this.set('table21', { id: 'table21', table: table21 })
		this.set('table22', { id: 'table22', table: table22 })
		this.set('table23', { id: 'table23', table: table23 })
		this.set('table24', { id: 'table24', table: table24 })
		this.set('table25', { id: 'table25', table: table25 })
		this.set('table26', { id: 'table26', table: table26 })
	}

	private _tables: Map<string, TableContainer> = new Map()

	public set(key: string, value: TableContainer): void {
		this._tables.set(key, value)
	}

	public table(name: string = this._defaultTableName): ColumnTable {
		return this._tables.get(name)!.table!
	}
}
