/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import type { ICommandBarProps } from '@fluentui/react'
import { ThemeVariant } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'

import { CommandBar } from '../CommandBar/index.js'
import { useProjectMgmtCommands } from './hooks/index.js'

export interface ProjectMgmtCommandBarProps
	extends Omit<ICommandBarProps, 'items'> {
	steps: Step[]
	tables: TableContainer[]
	outputTable?: TableContainer
	onUpdateSteps?: (steps: Step[]) => void
	onUpdateTables?: (tables: TableContainer[]) => void
}

export const ProjectMgmtCommandBar: React.FC<ProjectMgmtCommandBarProps> = memo(
	function ProjectMgmtCommandBar({
		steps,
		tables,
		outputTable,
		onUpdateSteps,
		onUpdateTables,
		...props
	}) {
		const theme = useThematic()
		const commands = useProjectMgmtCommands(
			steps,
			tables,
			outputTable,
			onUpdateSteps,
			onUpdateTables,
		)
		return (
			<CommandBar
				items={commands}
				bgColor={
					theme.variant === ThemeVariant.Light
						? theme.application().highContrast().hex()
						: theme.application().lowContrast().hex()
				}
				color={
					theme.variant === ThemeVariant.Light
						? theme.application().lowContrast().hex()
						: theme.application().midHighContrast().hex()
				}
				{...props}
			/>
		)
	},
)
