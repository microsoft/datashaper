/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { IconButton, IIconProps, TooltipHost } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { useCanDelete, useHasDelete } from './hooks'

export function useTableButtons(
	steps?: Step[],
): (
	item: any,
	onSelect?: (name: string) => void,
	onDelete?: (name: string) => void,
) => JSX.Element {
	const hasDelete = useHasDelete()
	const canDelete = useCanDelete(steps)

	return useCallback(
		(
			item: any,
			onSelect?: (name: string) => void,
			onDelete?: (name: string) => void,
		) => {
			return (
				<ContainerButton>
					{hasDelete(item) && (
						<TableButton
							title="Delete table"
							iconProps={iconProps.delete}
							item={item}
							disabled={!canDelete(item)}
							fn={onDelete}
						/>
					)}
					<TableButton
						title="Preview table"
						iconProps={iconProps.preview}
						item={item}
						fn={onSelect}
					/>
				</ContainerButton>
			)
		},
		[canDelete, hasDelete],
	)
}

export const TableButton: React.FC<{
	item: any
	title: string
	iconProps: IIconProps
	disabled?: boolean
	fn?: (name: string) => void
}> = memo(function PreviewTableButton({
	item,
	fn,
	iconProps,
	title,
	disabled,
}) {
	return (
		<Container>
			<TooltipHost content={title}>
				<Button
					disabled={disabled}
					iconProps={iconProps}
					onClick={() => fn && fn(item.name)}
					aria-label={title}
				/>
			</TooltipHost>
		</Container>
	)
})

const Button = styled(IconButton)`
	height: 26px;
	width: 26px;
`

const Container = styled.div`
	float: right;
`

const ContainerButton = styled.div`
	display: flex;
	column-gap: 6px;
	float: right;
`

const iconProps = {
	preview: { iconName: 'RedEye' },
	delete: { iconName: 'Delete' },
}
