/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { Allotment } from 'allotment'
import { memo } from 'react'

import { FileTreeCommands } from './FileTreeCommands.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import { HelpPanel } from './HelpPanel.js'
import {
	Container,
	FooterMenu,
	PanelContainer,
	icons,
	TreeContainer,
} from './ResourcesPane.styles.js'
import type { ResourcesPaneProps } from './ResourcesPane.types.js'
import { ResourceTree } from './ResourceTree.js'
import { SettingsPanel } from './SettingsPanel.js'
export const ResourcesPane: React.FC<ResourcesPaneProps> = memo(
	function ResourcesPane({
		style,
		className,
		narrow,
		examples,
		selectedKey,
		resources,
		profiles,
		onToggleNarrow,
		onSelect,
		currentHelp,
		helpContent,
	}) {
		const expandCollapseTooltip = narrow
			? 'Show more information'
			: 'Show less information'
		const [helpVisible, { toggle: onToggleHelp }] = useBoolean(false)
		const helpTooltip = `${helpVisible ? 'Hide' : 'Show'} interactive guidance`
		const [settingsVisible, { toggle: onToggleSettings }] = useBoolean(false)
		const settingsTooltip = `${
			settingsVisible ? 'Hide' : 'Show'
		} settings window`
		return (
			<Container style={style} className={className}>
				<FileTreeCommands
					narrow={narrow}
					examples={examples}
					profiles={profiles}
				/>
				<Allotment vertical>
					<Allotment.Pane>
						<TreeContainer>
							<ResourceTree
								resources={resources}
								profiles={profiles}
								narrow={narrow}
								selectedRoute={selectedKey}
								onSelect={onSelect}
							/>
						</TreeContainer>
					</Allotment.Pane>
					{!narrow && helpVisible && (
						<Allotment.Pane>
							<PanelContainer>
								<HelpPanel
									currentHelp={currentHelp}
									helpContent={helpContent}
									onToggleExpanded={onToggleHelp}
								/>
							</PanelContainer>
						</Allotment.Pane>
					)}
					{!narrow && settingsVisible && (
						<Allotment.Pane>
							<PanelContainer>
								<SettingsPanel
									resources={resources}
									profiles={profiles}
									onToggleExpanded={onToggleSettings}
								/>
							</PanelContainer>
						</Allotment.Pane>
					)}
				</Allotment>
				<FooterMenu>
					{!narrow && (
						<div>
							<Tooltip content={helpTooltip} styles={tooltipStyles}>
								<IconButton onClick={onToggleHelp} iconProps={icons.help} ariaLabel="Open help"/>
							</Tooltip>
							<Tooltip content={settingsTooltip} styles={tooltipStyles}>
								<IconButton
									onClick={onToggleSettings}
									iconProps={icons.settings}
									ariaLabel="Open settings"
								/>
							</Tooltip>
						</div>
					)}
					<Tooltip content={expandCollapseTooltip} styles={tooltipStyles}>
						<IconButton
							onClick={onToggleNarrow}
							iconProps={narrow ? icons.expand : icons.collapse}
							ariaLabel="Collapse resource pane"
						/>
					</Tooltip>
				</FooterMenu>
			</Container>
		)
	},
)

const tooltipStyles = {
	root: {
		width: 32,
	},
}
