/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs } from '@datashaper/schema'
import type { Value } from '@essex/arquero'
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const recodeStep: ColumnTableStep<RecodeArgs> = (
	input,
	{ column, to, map },
) => {
	//TODO Datatype conditional statement and recode error with map
	const finalMap: Record<Value, Value> = {}

	for (const key in map) {
		const dateConversion = new Date(key)
		const valueConversion = new Date(map[key])
		finalMap[dateConversion.toString()] = valueConversion
	}

	input.derive({
		[to]: escape((d: any) => op.recode(d[column], finalMap)),
	})
}

export const recode = stepVerbFactory(recodeStep)
