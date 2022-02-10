/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TooltipHost } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

export function usePreviewTableButton(): (
	item: any,
	onSelect?: (name: string) => void,
) => JSX.Element {
	return useCallback((item: any, onSelect?: (name: string) => void) => {
		return <PreviewTableButton item={item} onSelect={onSelect} />
	}, [])
}

export const PreviewTableButton: React.FC<{
	item: any
	onSelect?: (name: string) => void
}> = memo(function PreviewTableButton({ item, onSelect }) {
	return (
		<Container>
			<TooltipHost content="Preview table">
				<IconButton
					iconProps={iconProps.preview}
					onClick={() => onSelect && onSelect(item.name)}
					aria-label="Preview"
				/>
			</TooltipHost>
		</Container>
	)
})

const Container = styled.div`
	float: right;
`

const iconProps = {
	preview: { iconName: 'RedEye' },
}
