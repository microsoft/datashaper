/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import { useMemo } from 'react'

export function useRightColumn(step: Step<JoinArgs>): string | undefined {
	return useMemo(() => getRightColumn(step), [step])
}

export function getRightColumn(step: Step<JoinArgs>): string | undefined {
	return step.args.on && step.args.on.length > 1 ? step.args.on[1] : undefined
}
