/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	width: auto;
`

export const TreeContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: auto;
`

export const PanelContainer = styled.div`
	width: 100%;
	height: 100%;
	border-top: 2px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const FooterMenu = styled.div`
	display: flex;
	justify-content: space-between;
	border-top: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const icons = {
	table: { iconName: 'Table' },
	save: { iconName: 'Save' },
	expand: { iconName: 'DoubleChevronRight12' },
	collapse: { iconName: 'DoubleChevronLeft12' },
	project: { iconName: 'ZipFolder' },
	openFile: { iconName: 'FabricOpenFolderHorizontal' },
	newFile: { iconName: 'NewFolder' },
	help: { iconName: 'ReadingMode' },
	settings: { iconName: 'Settings' },
}
