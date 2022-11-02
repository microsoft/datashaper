/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'

export interface CommandBarColors {
	color: string
	background: string
	border: string
	disabled: string
	checked: string
	hovered: string
	pressed: string
}

export type StepChangeFunction<T extends object | void | unknown = unknown> = (
	step: Step<T>,
) => void
