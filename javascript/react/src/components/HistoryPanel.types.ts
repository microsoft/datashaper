/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@datashaper/workflow'

import type { DisplayOrder } from '../enums.js'

export interface HistoryPanelProps {
	isCollapsed: boolean
	toggleCollapsed: () => void
	title?: string
	order?: DisplayOrder
	showStepCount?: boolean
	steps?: Step[]
	titleStyle?: React.CSSProperties
	children?: React.ReactNode
}
