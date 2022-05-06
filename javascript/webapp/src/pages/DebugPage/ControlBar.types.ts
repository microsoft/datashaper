/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Workflow } from '@data-wrangling-components/core'
import { TableContainer } from '@essex/arquero'
import type { DetailsListFeatures } from '@essex/arquero-react'

export interface ControlBarProps {
	selected?: Workflow
	onSelectSpecification?: (spec: Workflow | undefined) => void
	onLoadFiles?: (files: TableContainer[]) => void
	features: DetailsListFeatures
	onFeaturesChange?: (features: DetailsListFeatures) => void
	compact: boolean
	onCompactChange: (auto: boolean) => void
	autoType: boolean
	onAutoTypeChange: (autoType: boolean) => void
}
