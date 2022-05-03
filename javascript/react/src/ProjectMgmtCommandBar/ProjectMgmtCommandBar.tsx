/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type { ICommandBarProps } from '@fluentui/react'
import { ThemeVariant, Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'

import { CommandBar } from '../CommandBar/index.js'
import { useProjectMgmtCommands } from './ProjectMgmtCommandBar.hooks.js'

export interface ProjectMgmtCommandBarProps
	extends Omit<ICommandBarProps, 'items'> {
	/**
	 * The data transformation workflow
	 */
	workflow: Specification

	/**
	 * The input data tables
	 */
	tables: TableContainer[]

	/**
	 * The output data table
	 */
	outputTables: TableContainer[]

	/**
	 * Handler for when the workflow changes
	 */
	onUpdateWorkflow: (steps: Specification) => void

	/**
	 * Handler for when input tableset changes
	 */
	onUpdateTables: (tables: TableContainer[]) => void
}

export const ProjectMgmtCommandBar: React.FC<ProjectMgmtCommandBarProps> = memo(
	function ProjectMgmtCommandBar({
		workflow,
		tables,
		outputTables,
		onUpdateWorkflow,
		onUpdateTables,
		...props
	}) {
		const theme = useThematic()
		const commands = useProjectMgmtCommands(
			workflow,
			tables,
			outputTables,
			onUpdateWorkflow,
			onUpdateTables,
		)
		return (
			<CommandBar
				items={commands}
				bgColor={bgColor(theme)}
				color={color(theme)}
				{...props}
			/>
		)
	},
)

const bgColor = (theme: Theme) =>
	theme.variant === ThemeVariant.Light
		? theme.application().highContrast().hex()
		: theme.application().lowContrast().hex()

const color = (theme: Theme) =>
	theme.variant === ThemeVariant.Light
		? theme.application().lowContrast().hex()
		: theme.application().midHighContrast().hex()
