/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, Heading, LinkSection, ListItem } from './NavPanel.styles.js'
import type { NavPanelProps } from './NavPanel.types.js'

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	onDismiss,
}: NavPanelProps) {
	return (
		<Container onClick={onDismiss}>
			<Heading>Navigation</Heading>
			<LinkSection>
				<ListItem to={'/'} onClick={onDismiss}>
					Prepare Data
				</ListItem>
				<ListItem to={'/debug'} onClick={onDismiss}>
					Debug
				</ListItem>
				<ListItem to={'/performance'} onClick={onDismiss}>
					Performance
				</ListItem>
			</LinkSection>
		</Container>
	)
})
