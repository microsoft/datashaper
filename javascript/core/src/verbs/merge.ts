/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@essex/arquero'
import { columnType } from '@essex/arquero'
import { escape, from, not } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { RowObject } from 'arquero/dist/types/table/table'

import type { InputColumnListArgs, OutputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export enum MergeStrategy {
	FirstOneWins = 'first one wins',
	LastOneWins = 'last one wins',
	Concat = 'concat',
	CreateArray = 'array',
}

export interface MergeArgs extends InputColumnListArgs, OutputColumnArgs {
	strategy: MergeStrategy
	/**
	 * This is only necessary if mergeStrategy.Concat is used.
	 * If it is not supplied, the values are just mashed together.
	 */
	delimiter?: string
	unhot?: boolean
	prefix?: string
	keepOriginalColumns?: boolean
}

export const mergeStep: ColumnTableStep<MergeArgs> = (
	input,
	{
		columns = [],
		strategy,
		to,
		delimiter = '',
		unhot = false,
		prefix = '',
		keepOriginalColumns = false,
	},
) => {
	const tempTable = unhot ? unhotOperation(input, columns, prefix) : input

	const isSameDataTypeFlag: boolean = isSameDataType(tempTable, columns)

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		switch (strategy) {
			case MergeStrategy.LastOneWins:
				return lastOneWinsStrategy(isSameDataTypeFlag, d, columns)
			case MergeStrategy.Concat:
				return concatStrategy(d, columns, delimiter)
			case MergeStrategy.CreateArray:
				return arrayStrategy(d, columns)
			case MergeStrategy.FirstOneWins:
			default:
				return firstOneWinsStrategy(isSameDataTypeFlag, d, columns)
		}
	})

	if (keepOriginalColumns) return tempTable.derive({ [to]: func })

	return tempTable.derive({ [to]: func }).select(not(columns))
}

function unhotOperation(
	input: ColumnTable,
	columns: string[],
	prefix: string,
): ColumnTable {
	const inputTable: ColumnTable = from(input.objects())

	for (let i = 0; i < columns.length; i++) {
		const columnName: any = columns[i] ?? null
		const index = columnName !== null ? columnName.indexOf(prefix) : -1
		const value =
			index !== -1 && columnName !== null
				? columnName.substring(index + prefix.length)
				: null

		const obj = inputTable.data()

		if (columnName !== null && value !== null) {
			for (
				let j = 0;
				j < inputTable.data()[columnName as keyof typeof obj]['data']['length'];
				j++
			) {
				inputTable.data()[columnName as keyof typeof obj]['data'][`${j}`] === 0
					? ((inputTable.data()[columnName as keyof typeof obj]['data'][
							`${j}`
					  ] as any) = null)
					: ((inputTable.data()[columnName as keyof typeof obj]['data'][
							`${j}`
					  ] as any) = value)
			}
		}
	}

	return inputTable
}

function isSameDataType(inputTable: ColumnTable, columns: string[]): boolean {
	let allTypesAreTheSame = true
	const lastDataType: DataType = columnType(inputTable, columns[0]!)
	let i = 1

	while (allTypesAreTheSame === true && i < columns.length) {
		const dataType: DataType = columnType(inputTable, columns[i]!)
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

export const merge = stepVerbFactory(mergeStep)
