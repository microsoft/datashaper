/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { RowObject } from 'arquero/dist/types/table/table'
import type { ExprObject } from 'arquero/dist/types/table/transformable'
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import { columnType, MergeStrategy } from '../../index.js'
import type { DataType, MergeArgs, Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero merge operation.
 * @param step
 * @param store
 * @returns
 */

export async function merge(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns = [], strategy, to, delimiter = '' } = args as MergeArgs

	const inputTable = await store.table(input)

	const isSameDataTypeFlag: boolean = isSameDataType(inputTable, columns)

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		switch (strategy) {
			case MergeStrategy.LastOneWins:
				return lastOneWinsStrategy(isSameDataTypeFlag, d, columns)
			case MergeStrategy.Concat:
				return concatStrategy(d, columns, delimiter)
			case MergeStrategy.Array:
				return arrayStrategy(d, columns)
			case MergeStrategy.FirstOneWins:
			default:
				return firstOneWinsStrategy(isSameDataTypeFlag, d, columns)
		}
	})

	const dArgs: ExprObject = {
		[to]: func,
	}

	return container(output, inputTable.derive(dArgs))
}

function isSameDataType(inputTable: ColumnTable, columns: string[]): boolean {
	let allTypesAreTheSame = true
	const lastDataType: DataType = columnType(inputTable, columns[0] as string)
	let i = 1

	while (allTypesAreTheSame === true && i < columns.length) {
		const dataType: DataType = columnType(inputTable, columns[i] as string)
		allTypesAreTheSame = lastDataType === dataType
		i++
	}

	return allTypesAreTheSame
}

function firstOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
) {
	let firstValidValue: object = singleRow[columns[0]!]
	let foundFirstValidValue = false
	let i = 0

	while (!foundFirstValidValue && i < columns.length) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			firstValidValue = singleRow[columns[i]!]
			foundFirstValidValue = true
		}
		i++
	}

	return isSameDataTypeFlag ? firstValidValue : '' + firstValidValue
}

function lastOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
) {
	let lastValidValue: object = singleRow[columns[0]!]

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			lastValidValue = singleRow[columns[i]!]
		}
	}

	return isSameDataTypeFlag ? lastValidValue : '' + lastValidValue
}

function arrayStrategy(singleRow: RowObject, columns: string[]) {
	const concat = []

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			concat.push(singleRow[columns[i]!])
		}
	}

	return concat
}

function concatStrategy(
	singleRow: RowObject,
	columns: string[],
	delimiter: string,
) {
	return arrayStrategy(singleRow, columns).join(delimiter)
}
