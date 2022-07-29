/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, not } from 'arquero'

import type { InputColumnListArgs, OutputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { firstOneWinsStrategy, isSameDataType } from './util/merge-utils.js'
import { unhotOperation } from './util/unhot-logic.js'

export interface UnhotArgs extends InputColumnListArgs, OutputColumnArgs {
	prefix?: string
	keepOriginalColumns?: boolean
}

export const unhotStep: ColumnTableStep<UnhotArgs> = (
	input,
	{ columns = [], to, prefix = undefined, keepOriginalColumns = false },
) => {
	const tempTable = unhotOperation(input, columns, prefix)

	const isSameDataTypeFlag: boolean = isSameDataType(tempTable, columns)

	// eslint-disable-next-line
	const func: object = escape((d: any) => {
		return firstOneWinsStrategy(isSameDataTypeFlag, d, columns)
	})

	if (keepOriginalColumns) return tempTable.derive({ [to]: func })

	return tempTable.derive({ [to]: func }).select(not(columns))
}

export const unhot = stepVerbFactory(unhotStep)
