/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback, useState } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'
import { RenameCallout } from './RenameCallout'

interface TableNameProps {
	onRenameTable?: (name: string) => void
	name?: string
}

/**
 * Renders the table name if passed, or the option to rename the name if the function
 * onRenameTable is passed to be called when clicking save or pressing enter on the callout
 */
export const TableName: React.FC<TableNameProps> = memo(function TableName({
	onRenameTable,
	name,
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState(name || '')

	const onChange = useCallback(
		(e: any, value?: string) => {
			setEditedName(value as string)
		},
		[setEditedName],
	)

	const onSend = useCallback(
		(newName?: string) => {
			// if the user enters an empty value, save the previous value
			const incomingName = (!newName ? name : newName) as string
			onRenameTable && onRenameTable(incomingName)
			setIsEditing(false)
			setEditedName(incomingName)
		},
		[onRenameTable, setIsEditing, setEditedName, name],
	)

	return (
		<Container>
			<If condition={!!onRenameTable}>
				<Then>
					<Container>
						<H3Editable
							id="editName"
							title="Edit"
							onClick={() => setIsEditing(true)}
						>
							{name}
						</H3Editable>
						<If condition={isEditing}>
							<Then>
								<RenameCallout
									onSend={onSend}
									editedName={editedName}
									onChange={onChange}
									name={name}
								/>
							</Then>
						</If>
					</Container>
				</Then>
				<Else>
					<If condition={name}>
						<Then>
							<H3>{name}</H3>
						</Then>
					</If>
				</Else>
			</If>
		</Container>
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

const Container = styled.div``
