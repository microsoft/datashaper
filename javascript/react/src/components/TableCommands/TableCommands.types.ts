/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import type { Step, Workflow } from '@datashaper/workflow'
import type { ICommandBarProps } from '@fluentui/react'

export interface TableCommandsProps {
	workflow: Workflow
	selectedColumn?: string
	metadata?: TableMetadata
	onAddStep?: (
		step: Step,
		output: string | undefined,
		index: number | undefined,
	) => void
	onRemoveStep?: (index: number) => void
	color?: string
	background?: string
	commandBarProps?: Partial<ICommandBarProps>
}

/**
 * Verb grouping configuration
 */
export interface GroupedVerbs {
	label: string
	verbs: Verb[]
	alwaysEnabled?: boolean
}
