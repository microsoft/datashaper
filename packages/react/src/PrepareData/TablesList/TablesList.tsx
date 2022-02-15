/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BaseFile } from '@data-wrangling-components/utilities'
import { IconButton, TooltipHost } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useIsTableSelected } from './hooks'

export const TablesList: React.FC<{
	tables: BaseFile[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TablesList({ tables, onSelect, selected }) {
	const isSelected = useIsTableSelected(selected)

	return (
		<ListContainer>
			{tables.map(table => {
				return (
					<TooltipHost content={'Preview table'}>
						<TableContainer
							isSelected={isSelected(table.name)}
							onClick={() => onSelect && onSelect(table.name)}
						>
							<TableName>{table.name}</TableName>
							<Button iconProps={iconProps.preview} />
						</TableContainer>
					</TooltipHost>
				)
			})}
		</ListContainer>
	)
})

const iconProps = {
	preview: { iconName: 'RedEye' },
}

const Button = styled(IconButton)`
	height: 26px;
	width: 26px;
`

const TableName = styled.span``
const ListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	width: 100%;
`

const TableContainer = styled.div<{ isSelected: boolean }>`
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	/* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
	border-radius: 4px;
	padding: 4px;
	margin: 2px;
	color: ${({ theme, isSelected }) =>
		isSelected ? theme.application().accent().hex() : 'inherit'};
	font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
`
