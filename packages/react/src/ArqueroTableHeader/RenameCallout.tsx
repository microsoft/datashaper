/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DirectionalHint, FocusTrapCallout, TextField } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

interface RenameCalloutProps {
	onSend: (name?: string) => void
	onChange: (evt: any, value?: string) => void
	editedName: string
	name?: string
}

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

const FocusCallout = styled(FocusTrapCallout)`
	width: 320;
	max-width: 90%;
	padding: 10px;
`
