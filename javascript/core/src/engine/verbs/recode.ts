/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import type { RecodeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

/**
 * Executes an arquero derive to map a list of values to new values.
 * Commonly used for recategorization.
 */
const doRecode = wrapColumnStep<RecodeArgs>((input, { column, to, map }) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	}),
)

export const recode = makeStepFunction(doRecode)
export const recodeNode = makeStepNode(doRecode)
