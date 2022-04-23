/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DocumentCard,
	DocumentCardTitle,
	Icon,
	TooltipHost,
} from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

export const TableCard: React.FC<{
	index: number
	tableName: string
	isSelected: (name: string) => boolean
	onSelect?: (name: string) => void
}> = memo(function TableCard({ index, tableName, isSelected, onSelect }) {
	return (
		<TooltipHost key={index} content={'Preview table'}>
			<Card
				isSelected={isSelected(tableName)}
				onClick={() => onSelect?.(tableName)}
			>
				<DocumentCardTitle
					styles={styles.title}
					showAsSecondaryTitle
					title={tableName}
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
	preview: { iconName: 'View' },
}

const PreviewIcon = styled(Icon)`
	color: ${({ theme }) => theme.application().accent().hex()};
	align-self: center;
`

const Card = styled(DocumentCard)<{ isSelected: boolean }>`
	margin-top: unset !important;
	display: flex;
	justify-content: space-between;
	padding: 4px 8px 4px 4px;
	border: 1px solid
		${({ theme, isSelected }) =>
			isSelected ? theme.palette.neutralTertiary : theme.palette.neutralLight};
	font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
`
