/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { RowObject } from 'arquero/dist/types/table/table'
import { columnType, MergeStrategy, TableStore } from '../..'
import { DataType, MergeArgs, Step } from '../../types'
import { ExprObject } from 'arquero/dist/types/table/transformable'
import { escape } from 'arquero'

/**
 * Executes an arquero merge operation.
 * @param step
 * @param store
 * @returns
 */

export async function merge(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns = [], strategy, to } = args as MergeArgs

	const inputTable = await store.get(input)

	let isSameDataTypeFlag: boolean = isSameDataType(inputTable, columns)

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		switch (strategy) {
			case MergeStrategy.LastOneWins:
				return lastOneWinsStrategy(isSameDataTypeFlag, d, columns)
			case MergeStrategy.Concat:
				return concatStrategy(d, columns)
			case MergeStrategy.FirstOneWins:
			default:
				return firstOneWinsStrategy(isSameDataTypeFlag, d, columns)
		}
	})

	const dArgs: ExprObject = {
		[to]: func,
	}

	return inputTable.derive(dArgs)
}

function isSameDataType(inputTable: ColumnTable, columns: string[]): boolean {
	let allTypesAreTheSame: boolean = true
	let lastDataType: DataType = columnType(inputTable, columns[0])
	let i = 1

	while (allTypesAreTheSame === true && i < columns.length) {
		let dataType: DataType = columnType(inputTable, columns[i])
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
	let firstValidValue: object = singleRow[columns[0]]
	let foundFirstValidValue: boolean = false
	let i = 0

	while (!foundFirstValidValue && i < columns.length) {
		if (
			singleRow[columns[i]] !== undefined &&
			singleRow[columns[i]] !== null &&
			singleRow[columns[i]] != NaN
		) {
			firstValidValue = singleRow[columns[i]]
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
	let lastValidValue: object = singleRow[columns[0]]

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]] !== undefined &&
			singleRow[columns[i]] !== null &&
			singleRow[columns[i]] != NaN
		) {
			lastValidValue = singleRow[columns[i]]
		}
	}

	return isSameDataTypeFlag ? lastValidValue : '' + lastValidValue
}

function concatStrategy(singleRow: RowObject, columns: string[]) {
	let concatValue: string = ''

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]] !== undefined &&
			singleRow[columns[i]] !== null &&
			singleRow[columns[i]] != NaN
		) {
			concatValue = concatValue + singleRow[columns[i]]
		}
	}

	return concatValue
}
