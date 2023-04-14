/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'
import { memo, useState } from 'react'

import type { AppProfile } from '../../../types.js'
import { FileImport } from './FileImport.js'
import { useFileManagementCommands } from './FileTreeCommands.hooks.js'
import {
	CollapsedButton,
	collapsedButtonStyles,
	CollapsedCommands,
	Commands,
	icons,
	useCommandbarStyles,
} from './FileTreeCommands.styles.js'
import { FileTreeTooltip } from './FileTreeTooltip.js'
import type { FileDefinition } from './ResourcesPane.types.js'

const noop = () => undefined

export interface FileTreeCommandsProps {
	narrow?: boolean
	examples: FileDefinition[]
	profiles: Map<string, AppProfile>
}
export const FileTreeCommands: React.FC<FileTreeCommandsProps> = memo(
	function FileTreeCommands({ narrow, examples, profiles }) {
		const commandBarStyles = useCommandbarStyles()
		const [file, setFile] = useState<BaseFile | undefined>()
		const { commands, openCommands, newCommands, saveCommands } =
			useFileManagementCommands(examples, setFile, profiles, narrow)
		return (
			<>
				<FileImport file={file} setFile={setFile} />
				{narrow ? (
					<CollapsedCommands>
						<FileTreeTooltip content="New">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.newFile}
								menuProps={{
									items: newCommands,
								}}
							/>
						</FileTreeTooltip>
						<FileTreeTooltip content="Open">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.openFile}
								menuProps={{
									items: openCommands,
								}}
							/>
						</FileTreeTooltip>
						<FileTreeTooltip content="Save">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.save}
								menuProps={{
									items: saveCommands,
								}}
							/>
						</FileTreeTooltip>
					</CollapsedCommands>
				) : (
					<Commands
						items={commands}
						styles={commandBarStyles}
						onReduceData={noop}
					/>
				)}
			</>
		)
	},
)
