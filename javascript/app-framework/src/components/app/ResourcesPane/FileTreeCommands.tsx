/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'
import { memo, useState } from 'react'
import type { ProfilePlugin } from '../../../types.js'

import { FileImport } from './FileImport.js'
import {
	useFileManagementCommands,
	useOnOpenFileRequested,
} from './FileTreeCommands.hooks.js'
import {
	CollapsedButton,
	collapsedButtonStyles,
	Commands,
	icons,
	useCommandbarStyles,
} from './FileTreeCommands.styles.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import type { FileDefinition } from './ResourcesPane.types.js'

export interface FileTreeCommandsProps {
	expanded: boolean
	examples: FileDefinition[]
	plugins: Map<string, ProfilePlugin>
}
export const FileTreeCommands: React.FC<FileTreeCommandsProps> = memo(
	function FileTreeCommands({ expanded, examples, plugins }) {
		const commandBarStyles = useCommandbarStyles()
		const [file, setFile] = useState<BaseFile | undefined>()
		const onOpenFileRequested = useOnOpenFileRequested()
		const { commands, onOpenCommands, newCommands, onSaveCommands } =
			useFileManagementCommands(
				examples,
				expanded,
				onOpenFileRequested,
				setFile,
				plugins,
			)

		return (
			<>
				<FileImport file={file} setFile={setFile} />
				{expanded ? (
					<Commands items={commands} styles={commandBarStyles} />
				) : (
					<>
						<Tooltip content="New">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.newFile}
								menuProps={{
									items: newCommands,
								}}
							/>
						</Tooltip>
						<Tooltip content="Open">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.openFile}
								menuProps={{
									items: onOpenCommands,
								}}
							/>
						</Tooltip>
						<Tooltip content="Save">
							<CollapsedButton
								styles={collapsedButtonStyles}
								iconProps={icons.save}
								menuProps={{
									items: onSaveCommands,
								}}
							/>
						</Tooltip>
					</>
				)}
			</>
		)
	},
)
