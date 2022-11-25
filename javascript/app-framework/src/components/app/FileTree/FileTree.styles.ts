/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IconButton } from '@fluentui/react'
import {
	fluentTreeItem,
	fluentTreeView,
	provideFluentDesignSystem,
} from '@fluentui/web-components'
import { provideReactWrapper } from '@microsoft/fast-react-wrapper'
import React from 'react'
import styled from 'styled-components'

const { wrap } = provideReactWrapper(React, provideFluentDesignSystem())
const FluentTreeItem = wrap(fluentTreeItem())
export const TreeView = wrap(fluentTreeView())

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

export const ItemIcon = styled(Icon)``

export const TreeItem = styled(FluentTreeItem)`
	align-items: center;
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
}
