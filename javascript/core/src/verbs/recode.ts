/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnArgs, OutputColumnArgs } from './types.js'
import { stepNodeFactory } from './util/factories.js'
import type { Value } from '../tables/types.js'

export interface RecodeArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Mapping of old value to new for the recoding.
	 * Note that the key must be coercable to a string for map lookup.
	 */
	map: Record<Value, Value>
}

export const recodeStep: ColumnTableStep<RecodeArgs> = (
	input,
	{ column, to, map },
) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	})

export const recode = stepNodeFactory(recodeStep)
