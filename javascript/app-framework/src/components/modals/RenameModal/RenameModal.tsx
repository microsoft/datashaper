/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DefaultButton,
	PrimaryButton,
	TextField,
} from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import {
	buttonRowStyle,
	okButtonStyle,
} from './RenameModal.styles.js'
import type { RenameModalProps } from './RenameModal.types.js'
import { ModalHost } from '../ModalHost.js'

export const RenameModal: React.FC<RenameModalProps> = memo(
	function RenameModal({ isOpen, resource, onAccept, onDismiss }) {
		const [result, setResult] = useState(resource?.title)
		const onOkClick = useCallback(() => onAccept(result), [result, onAccept])
		const onTextFieldChange = useCallback(
			(_ev: unknown, v: string | undefined) => setResult(v),
			[setResult],
		)
	
		return (
			<ModalHost
				title={'Rename resource'}
				isOpen={isOpen}
				onDismiss={onDismiss}
			>
					<TextField
						label='New name'
						defaultValue={resource?.name}
						onChange={onTextFieldChange}
					/>
					<div style={buttonRowStyle}>
						<PrimaryButton
							text='OK'
							style={okButtonStyle}
							onClick={onOkClick}
						/>
						<DefaultButton text='Cancel' onClick={onDismiss} />
					</div>
			</ModalHost>
		)
	},
)
