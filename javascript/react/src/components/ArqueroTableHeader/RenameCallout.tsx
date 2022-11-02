/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DirectionalHint, TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { FocusCallout } from './RenameCallout.styles.js'
import type { RenameCalloutProps } from './RenameCallout.types.js'

/**
 * Renders the callout with a field to rename the table (and autofocus to the input)
 */
export const RenameCallout: React.FC<RenameCalloutProps> = memo(
	function RenameCallout({ onSend, onChange, editedName, name }) {
		const validateKeyEvent = useCallback(
			(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				if (e.key === 'Enter') return onSend(editedName)
				if (e.key === 'Escape') {
					onSend(name)
				}
			},
			[onSend, name, editedName],
		)

		return (
			<FocusCallout
				target="#editName"
				directionalHint={DirectionalHint.topCenter}
				onDismiss={() => onSend(name)}
			>
				<TextField
					value={editedName}
					onKeyDown={validateKeyEvent}
					onChange={onChange}
					underlined
				/>
			</FocusCallout>
		)
	},
)
