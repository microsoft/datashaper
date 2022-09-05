/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, StepInput } from '@datashaper/workflow'

export type StepAddFunction = (
	step: Step<unknown>,
	output?: string,
	index?: number,
) => void
export type StepUpdateFunction = (
	step: Partial<StepInput>,
	update: Partial<StepInput>,
) => void
export type StepRemoveFunction = (step: Partial<StepInput>) => void
