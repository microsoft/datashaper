/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'

import type { TransformModalProps } from '../index.js'

export enum WorkflowOrder {
	FirstOnTop = 'first on top',
	LastOnTop = 'last on top',
}

export interface ManageWorkflowProps
	extends Omit<Omit<TransformModalProps, 'workflow'>, 'index'> {
	/**
	 * The workflow specification
	 */
	workflow: Workflow

	/**
	 * Table selection handler
	 */
	onSelect?: (name: string) => void

	historyView?: boolean
	order?: WorkflowOrder
}
