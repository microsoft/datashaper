/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager, Step } from '@datashaper/core'
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
