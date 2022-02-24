/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Panel } from '@fluentui/react'
import { memo } from 'react'

export interface NavPanelProps {
	isOpen: boolean
	onDismiss: () => void
}

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	isOpen,
	onDismiss,
}: NavPanelProps) {
	return (
		<Panel
			isLightDismiss
			isOpen={isOpen}
			onDismiss={onDismiss}
			closeButtonAriaLabel="Close"
			headerText="Menu"
		>
			<h3>Settings</h3>
			<h3>Help</h3>
		</Panel>
	)
})
