/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, IIconProps, TooltipHost } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

export function useTableButtons(): (
	item: any,
	onSelect?: (name: string) => void,
) => JSX.Element {
	return useCallback((item: any, onSelect?: (name: string) => void) => {
		return (
			<ContainerButton>
				<TableButton
					title="Preview table"
					iconProps={iconProps.preview}
					item={item}
					fn={onSelect}
				/>
			</ContainerButton>
		)
	}, [])
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
}
