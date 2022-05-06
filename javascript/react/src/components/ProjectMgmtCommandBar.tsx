/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo } from 'react'

import { CommandBar } from './CommandBar.js'
import { useProjectMgmtCommands } from './ProjectMgmtCommandBar.hooks.js'
import { bgColor,color } from './ProjectMgmtCommandBar.styles.js'
import type { ProjectMgmtCommandBarProps } from './ProjectMgmtCommandBar.types.js'

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
