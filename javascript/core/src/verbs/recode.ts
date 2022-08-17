/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs } from '@datashaper/schema'
import { escape, op } from 'arquero'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const recodeStep: ColumnTableStep<RecodeArgs> = (
	input,
	{ column, to, map },
) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	})
export const recode = stepVerbFactory(recodeStep)
