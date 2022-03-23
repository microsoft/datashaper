/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'

import type { RecodeArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

/**
 * Executes an arquero derive to map a list of values to new values.
 * Commonly used for recategorization.
 */
export const recode = makeStepNode<RecodeArgs>((input, { column, to, map }) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	}),
)
