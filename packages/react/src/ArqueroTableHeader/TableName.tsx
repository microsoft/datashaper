/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import React, { memo, useCallback, useState } from 'react'
import { If, Then } from 'react-if'
import styled from 'styled-components'

interface TableNameProps {
	onRenameTable?: (name: string) => void
	name?: string
}

export const TableName: React.FC<TableNameProps> = memo(function TableName({
	onRenameTable,
	name,
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState(name || '')

	const onChange = useCallback(
		(e: any, value?: string) => {
			setEditedName(value || '')
		},
		[setEditedName],
	)

	const onSend = useCallback(
		(newName: string) => {
			onRenameTable && onRenameTable(newName)
			setIsEditing(false)
		},
		[onRenameTable, setIsEditing],
	)

	const validateKeyEvent = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (e.key === 'Enter') return onSend(editedName)
			if (e.key === 'Escape') {
				onSend(name || '')
			}
		},
		[onSend, name, editedName],
	)

	return (
		<>
			<If condition={isEditing}>
				<Then>
					<TextInput
						underlined
						borderless
						value={editedName}
						onKeyDown={validateKeyEvent}
						onChange={onChange}
					/>
				</Then>
			</If>
			<If condition={!!onRenameTable}>
				<Then>
					<H3Editable title="Edit" onClick={() => setIsEditing(true)}>
						{name}
					</H3Editable>
				</Then>
			</If>
			<If condition={name}>
				<Then>
					<H3>{name}</H3>
				</Then>
			</If>
		</>
	)
})

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`

const H3Editable = styled(H3)`
	cursor: pointer;
	border-bottom: 1px dotted
		${({ theme }) => theme.application().background().hex()};
`

const TextInput = styled(TextField)`
	.ms-TextField-fieldGroup {
		height: 25px;
	}
	input {
		align-self: center;
	}
`
