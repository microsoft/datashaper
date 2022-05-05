import type { Verb } from '@data-wrangling-components/core'

export interface StepSelectorProps {
	onCreate?: (verb: Verb) => void
	showButton?: boolean
	verb?: Verb
	placeholder?: string
}
