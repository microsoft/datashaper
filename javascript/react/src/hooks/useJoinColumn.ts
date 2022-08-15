/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs, Step } from '@datashaper/core'
import { useMemo } from 'react'

export function useLeftColumn(step: Step<JoinArgs>): string | undefined {
	return useMemo(() => getLeftColumn(step), [step])
}

export function getLeftColumn(step: Step<JoinArgs>): string | undefined {
	return step.args.on && step.args.on.length > 0 ? step.args.on[0] : undefined
}

export function useRightColumn(step: Step<JoinArgs>): string | undefined {
	return useMemo(() => getRightColumn(step), [step])
}

export function getRightColumn(step: Step<JoinArgs>): string | undefined {
	return step.args.on && step.args.on.length > 1 ? step.args.on[1] : undefined
}
