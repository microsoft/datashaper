/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'
import merge from 'lodash-es/merge.js'
import { memo, useState } from 'react'

import { FileImport } from './FileImport.js'
import {
	useFileManagementCommands,
	useOnOpenFileRequested,
} from './FileTree.hooks.js'
import {
	CollapsedButton,
	collapsedButtonStyles,
	Commands,
	Container,
	ExpandButton,
	icons,
	MenuContainer,
	useCommandbarStyles,
} from './FileTree.styles.js'
import type { FileTreeProps } from './FileTree.types.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import { TreeItems } from './TreeItems.js'

const emptyArray: any[] = Object.freeze([]) as any

export const FileTree: React.FC<FileTreeProps> = memo(function FileTree({
	style,
	className,
	expanded,
	toggleExpanded,
	examples = emptyArray,
	appResources = emptyArray,
	selectedKey,
	onSelect,
}) {
	const [file, setFile] = useState<BaseFile | undefined>()
	const onOpenFileRequested = useOnOpenFileRequested()
	const { commands, onOpenCommands, onSaveCommands } =
		useFileManagementCommands(examples, expanded, onOpenFileRequested, setFile)
	const commandBarStyles = useCommandbarStyles()

	return (
		<Container style={merge({ width: 'auto' }, style)} className={className}>
			<MenuContainer>
				<FileImport file={file} setFile={setFile} />
				{expanded ? (
					<Commands items={commands} styles={commandBarStyles} />
				) : (
					<>
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

				<TreeItems
					expanded={expanded}
					appLinks={appResources}
					selectedRoute={selectedKey}
					onSelect={onSelect}
				/>
			</MenuContainer>
			<Tooltip
				content={expanded ? 'Show less information' : 'Show more information'}
			>
				<ExpandButton
					onClick={toggleExpanded}
					iconProps={
						expanded ? icons.closeExpandedView : icons.openExpandedView
					}
				/>
			</Tooltip>
		</Container>
	)
})
