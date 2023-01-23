/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MarkdownBrowser } from '@essex/components'
import { IconButton } from '@fluentui/react'
import { memo } from 'react'
import { Else, If, Then } from 'react-if'
import { Container, Content, Header } from './HelpPanel.styles.js'
import type { HelpPanelProps } from './HelpPanel.types.js'
import { icons } from './ResourcesPane.styles.js'

export const HelpPanel: React.FC<HelpPanelProps> = memo(function HelpPanel({
	onToggleExpanded,
	currentHelp,
	helpContent,
}) {
	return (
		<Container>
			<Header>
				<IconButton iconProps={icons.help} onClick={onToggleExpanded} />
				Guidance
			</Header>
			<Content>
				<If condition={currentHelp != null}>
					<Then>
						<MarkdownBrowser home={currentHelp!} content={helpContent} />
					</Then>
					<Else>No help content selected.</Else>
				</If>
			</Content>
		</Container>
	)
})
