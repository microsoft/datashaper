import type { Step, GraphManager } from '@data-wrangling-components/core'
import type { DetailsListFeatures } from '@essex/arquero-react'

export interface StepOutputProps {
	step: Step
	output: string
	index: number
	graph: GraphManager
	features: DetailsListFeatures
	compact: boolean

	onStepChange: (step: Step, index: number) => void
	onStepOutputChange: (step: Step, output: string | undefined) => void
}
