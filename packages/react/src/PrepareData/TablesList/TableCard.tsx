/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@data-wrangling-components/utilities'
import {
	DocumentCard,
	DocumentCardTitle,
	Icon,
	TooltipHost,
} from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

export const TableCard: React.FC<{
	index: number
	table: BaseFile
	isSelected: (name: string) => boolean
	onSelect?: (name: string) => void
}> = memo(function TableCard({ index, table, isSelected, onSelect }) {
	return (
		<TooltipHost key={index} content={'Preview table'}>
			<Card
				isSelected={isSelected(table.name)}
				onClick={() => onSelect && onSelect(table.name)}
			>
				<DocumentCardTitle
					styles={styles.title}
					showAsSecondaryTitle
					title={table.name}
				/>
				<PreviewIcon iconName={iconProps.preview.iconName} />
			</Card>
		</TooltipHost>
	)
})

const styles = {
	title: { root: { padding: '1px 5px', height: 'min-content' } },
}

const iconProps = {
	preview: { iconName: 'RedEye' },
}

const PreviewIcon = styled(Icon)`
	color: ${({ theme }) => theme.application().accent().hex()};
	align-self: center;
`

const Card = styled(DocumentCard)<{ isSelected: boolean }>`
	margin-top: unset !important;
	display: flex;
	justify-content: space-between;
	padding: 4px;
	margin: 2px;
	border: 1px solid
		${({ theme, isSelected }) =>
			isSelected ? theme.palette.neutralTertiary : theme.palette.neutralLight};
	font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
`
