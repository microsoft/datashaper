import type { Step, JoinArgs } from '@data-wrangling-components/core'
import { useMemo } from 'react'

export function useLeftColumn(step: Step<JoinArgs>) {
	return useMemo(() => getLeftColumn(step), [step])
}

export function getLeftColumn(step: Step<JoinArgs>): string | undefined {
	return step.args.on && step.args.on.length > 0 ? step.args.on[0] : undefined
}

export function useRightColumn(step: Step<JoinArgs>) {
	return useMemo(() => getRightColumn(step), [step])
}

export function getRightColumn(step: Step<JoinArgs>): string | undefined {
	return step.args.on && step.args.on.length > 1 ? step.args.on[1] : undefined
}
