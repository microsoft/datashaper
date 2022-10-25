/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface HistoryPanelProps {
	toggleCollapsed: () => void
	title?: string
	showStepCount?: boolean
	numSteps?: number
	titleStyle?: React.CSSProperties
	children?: React.ReactNode
}
