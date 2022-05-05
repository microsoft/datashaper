import type { GraphManager, Step } from '@data-wrangling-components/core'

export interface StepComponentProps {
	step: Step
	graph: GraphManager
	index: number
	onChange: (step: Step, index: number) => void
}
