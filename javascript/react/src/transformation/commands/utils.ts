/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'
import isMatch from 'lodash-es/isMatch.js'

export function findStep<T>(
	steps: Step[],
	template: Partial<Step<T>>,
): { step: Step<T> | undefined; index: number } {
	const index = steps.findIndex(step => isMatch(step as any, template as any))
	return {
		step: steps[index] as Step<T>,
		index,
	}
}
