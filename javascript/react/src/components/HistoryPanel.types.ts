/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Workflow } from '@datashaper/workflow'

import type { DisplayOrder } from '../enums.js'

export interface HistoryPanelProps {
	isCollapsed: boolean
	toggleCollapsed: () => void
	setSelectedTableId: (tableId: string) => void
	workflow: Workflow
	title?: string
	order?: DisplayOrder
	titleStyle?: React.CSSProperties
}
