import type { Step } from '@data-wrangling-components/core'

export interface StepListProps {
	steps: Step[]
	outputs: Array<string | undefined>
	buttonId?: string | undefined
	onDeleteClicked?: (index: number) => void
	onEditClicked?: (step: Step, index: number) => void
	onDuplicateClicked?: (step: Step) => void
	onSelect?: (name: string) => void
	onStartNewStep?: () => void
}
