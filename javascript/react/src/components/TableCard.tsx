/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentCardTitle, TooltipHost } from '@fluentui/react'
import { memo } from 'react'
import type { TableCardProps } from './TableCard.types.js'
import { styles, icons, PreviewIcon, Card } from './TableCard.styles.js'

export const TableCard: React.FC<TableCardProps> = memo(function TableCard({
	index,
	tableName,
	isSelected,
	onSelect,
}) {
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
				<PreviewIcon iconName={icons.preview.iconName} />
			</Card>
		</TooltipHost>
	)
})
