/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DefaultButton,
	IconButton,
	Modal,
	PrimaryButton,
	TextField,
} from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import {
	buttonRowStyle,
	cancelIcon,
	okButtonStyle,
	useContentStyles,
	useIconButtonStyles,
} from './RenameModal.styles.js'
import type { RenameModalProps } from './RenameModal.types.js'

export const RenameModal: React.FC<RenameModalProps> = memo(
	function RenameModal({ isOpen, resource, onAccept, onDismiss }) {
		const [result, setResult] = useState(resource?.title)
		const onOkClick = useCallback(() => onAccept(result), [result, onAccept])
		const onTextFieldChange = useCallback(
			(_ev: unknown, v: string | undefined) => setResult(v),
			[setResult],
		)
		const contentStyles = useContentStyles()
		const iconButtonStyles = useIconButtonStyles()
		return (
			<Modal
				titleAriaId={'rename-modal'}
				isOpen={isOpen}
				onDismiss={onDismiss}
				isBlocking={false}
				containerClassName={contentStyles.container}
			>
				<div className={contentStyles.header}>
					<span id={'title'}>Rename Resource</span>
					<IconButton
						styles={iconButtonStyles}
						iconProps={cancelIcon}
						ariaLabel="Close popup modal"
						onClick={onDismiss}
					/>
				</div>
				<div className={contentStyles.body}>
					<TextField
						label="Rename resource"
						defaultValue={resource?.name}
						onChange={onTextFieldChange}
					/>
					<div style={buttonRowStyle}>
						<PrimaryButton
							text="OK"
							style={okButtonStyle}
							onClick={onOkClick}
						/>
						<DefaultButton text="Cancel" onClick={onDismiss} />
					</div>
				</div>
			</Modal>
		)
	},
)
