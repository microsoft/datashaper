/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { ThemeVariant } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'

import { CommandBar } from '../CommandBar/index.js'
import { useProjectMgmtCommands } from './hooks/index.js'

interface Props {
	steps: Step[]
	tables: TableContainer[]
	outputTable?: TableContainer
	onUpdateSteps?: (steps: Step[]) => void
	onUpdateTables?: (tables: TableContainer[]) => void
}

export const ProjectMgmtCommandBar: React.FC<Props> = memo(
	function ProjectMgmtCommandBar({
		steps,
		tables,
		outputTable,
		onUpdateSteps,
		onUpdateTables,
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
			<Container>
				<CommandBar
					commands={commands}
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
					height="36px"
					width="100%"
					styles={{ root: { float: 'left', marginLeft: '2rem' } }}
				/>
			</Container>
		)
	},
)

const Container = styled.section``
