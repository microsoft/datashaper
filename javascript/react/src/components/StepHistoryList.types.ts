/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import type { CSSProperties } from 'react'

import type { DisplayOrder } from '../enums.js'
import type { StepHeaderStyles } from './internal/StepHeader.types.js'

export interface StepHistoryStyles {
	root?: CSSProperties
	buttonContainer?: CSSProperties
	stepsContainer?: CSSProperties
	stepHeaders?: StepHeaderStyles
}

export interface StepHistoryListProps {
	workflow: Workflow
	order?: DisplayOrder
	/**
	 * Indicates whether the original/latest buttons will be shown.
	 * Note that they will have no effect if you do not supply an onSelect handler too.
	 */
	showSelectButtons?: boolean
	onDelete?: (index: number) => void
	onSelect?: (name: string) => void
	onSave?: (step: Step, index?: number) => void
	styles?: StepHistoryStyles
}
