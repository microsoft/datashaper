/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import React, { memo, useCallback, useState } from 'react'
import { Else, If, Then } from 'react-if'
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

	const onSend = useCallback(() => {
		onRenameTable && name && onRenameTable(editedName || name)
		setIsEditing(false)
	}, [editedName])

	return (
		<If condition={isEditing}>
			<Then>
				<TextField
					underlined
					borderless
					value={editedName}
					onKeyPress={e => e.key === 'Enter' && onSend()}
					onChange={onChange}
				/>
			</Then>
			<Else>
				<If condition={name}>
					<Then>
						<H3 onClick={() => onRenameTable && setIsEditing(true)}>{name}</H3>
					</Then>
				</If>
			</Else>
		</If>
	)
})

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	cursor: pointer;
	margin-right: 8px;
	border-bottom: 1px dotted
		${({ theme }) => theme.application().background().hex()};
	color: ${({ theme }) => theme.application().background().hex()};
`
