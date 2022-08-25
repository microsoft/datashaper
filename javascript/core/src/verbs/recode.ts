/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/arquero'
import { columnType } from '@datashaper/arquero'
import type { RecodeArgs } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const recodeStep: ColumnTableStep<RecodeArgs> = (
	input,
	{ column, to, map },
) => {
	const finalMap: Record<Value, Value> = {}

	const dataType = columnType(input, column)

	if (dataType === DataType.Date) {
		for (const key in map) {
			const dateConversion = new Date(key)
			const valueConversion = new Date(map[key])
			finalMap[dateConversion.toString()] = valueConversion
		}
	}

	return input.derive({
		[to]: escape((d: any) =>
			op.recode(d[column], dataType === DataType.Date ? finalMap : map),
		),
	})
}

export const recode = stepVerbFactory(recodeStep)
