/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	IconButton,
	Modal,
} from '@fluentui/react'
import { memo } from 'react'

import {
	cancelIcon,
	useContentStyles,
	useIconButtonStyles,
} from './ModalHost.styles.js'
import type { ModalHostProps } from './ModalHost.types.js'

export const ModalHost: React.FC<ModalHostProps> = memo(
	function ModalHost({ isOpen, onDismiss, children, title }) {
		const contentStyles = useContentStyles()
		const iconButtonStyles = useIconButtonStyles()
		return (
			<Modal
				isOpen={isOpen}
				onDismiss={onDismiss}
				isBlocking={false}
				containerClassName={contentStyles.container}
			>
				<div className={contentStyles.header}>
					<span id={'title'}>{title}</span>
					<IconButton
						styles={iconButtonStyles}
						iconProps={cancelIcon}
						ariaLabel='Close popup modal'
						onClick={onDismiss}
					/>
				</div>
				<div className={contentStyles.body}>
					{children}
				</div>
			</Modal>
		)
	},
)
