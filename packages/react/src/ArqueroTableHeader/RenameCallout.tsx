/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DefaultButton,
	DirectionalHint,
	FocusTrapCallout,
	FocusZone,
	PrimaryButton,
	TextField,
} from '@fluentui/react'
import React, { memo, useCallback } from 'react'
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
				<Title>Rename table</Title>
				<FocusZone>
					<TextField
						value={editedName}
						onKeyDown={validateKeyEvent}
						onChange={onChange}
					/>
				</FocusZone>
				<ButtonContainer>
					<PrimaryButton onClick={() => onSend(editedName)} text="Save" />
					<DefaultButton onClick={() => onSend(name)} text="Cancel" />
				</ButtonContainer>
			</FocusCallout>
		)
	},
)

const ButtonContainer = styled.div`
	margin-top: 8px;
	display: flex;
	gap: 12px;
`

const Title = styled.h4``

const FocusCallout = styled(FocusTrapCallout)`
	width: 320;
	max-width: 90%;
	padding: 0px 24px;
	padding-bottom: 24px;
`
