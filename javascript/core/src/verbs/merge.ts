/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, not } from 'arquero'

import type { InputColumnListArgs, OutputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import {
	arrayStrategy,
	concatStrategy,
	firstOneWinsStrategy,
	isSameDataType,
	lastOneWinsStrategy,
} from './util/merge-utils.js'
import { unhotOperation } from './util/unhot-logic.js'

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

export const merge = stepVerbFactory(mergeStep)
