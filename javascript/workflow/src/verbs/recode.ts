/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { columnType } from '@datashaper/tables'
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const recodeStep: ColumnTableStep<RecodeArgs> = (
	input,
	{ column, to, mapping },
) => {
	const finalMap: Record<Value, Value> = mapping
	if (columnType(input, column) === DataType.Date) {
		for (const key in mapping) {
			const dateConversion = new Date(key)
			const valueConversion = new Date(mapping[key])
			finalMap[dateConversion.toString()] = valueConversion
		}
	}

	return input.derive({
		[to]: escape((d: any) => op.recode(d[column], finalMap)),
	})
}

export const recode = stepVerbFactory(recodeStep)
