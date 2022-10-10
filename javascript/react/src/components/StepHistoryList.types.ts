/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'

import type { DisplayOrder, TableTransformProps } from '../index.js'

export interface PanelProps {
	panelIsOpen: boolean
	onDismissPanel?: () => void
}

export interface StepHistoryListProps
	extends Pick<TableTransformProps, 'workflow'> {
	order?: DisplayOrder
	onDelete?: (index: number) => void
	onSelect?: (name: string) => void
	onSave?: (step: Step, output: string | undefined, index?: number) => void
}
