/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	width: auto;
`

export const MenuContainer = styled.div`
	width: 100%;
`
export const ExpandButton = styled(IconButton)`
	width: inherit;
`

export const icons = {
	table: { iconName: 'Table' },
	save: { iconName: 'Save' },
	expand: { iconName: 'DoubleChevronRight12' },
	collapse: { iconName: 'DoubleChevronLeft12' },
	project: { iconName: 'ZipFolder' },
	openFile: { iconName: 'FabricOpenFolderHorizontal' },
	newFile: { iconName: 'NewFolder' },
}
