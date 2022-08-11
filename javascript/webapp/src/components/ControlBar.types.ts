/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { Workflow } from '@datashaper/core'
import type { DetailsListFeatures } from '@datashaper/react'

export interface ControlBarProps {
	selected?: Workflow
	onSelectSpecification?: (spec: Workflow | undefined) => void
	onLoadFiles?: (files: TableContainer[]) => void
	features: DetailsListFeatures
	onFeaturesChange?: (features: DetailsListFeatures) => void
	autoType: boolean
	onAutoTypeChange: (autoType: boolean) => void
}
