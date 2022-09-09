/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'

export type StepAddFunction = (
	step: Step<unknown>,
	output?: string,
	index?: number,
) => void
export type StepUpdateFunction = (
	step: Step<unknown>,
	output?: string,
	index?: number,
) => void
export type StepRemoveFunction = (index: number) => void
