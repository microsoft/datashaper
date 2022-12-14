/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, ParserOptions } from '@datashaper/schema'
import type { DataShape } from '@datashaper/schema/dist/datatable/DataShape.js'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'

import type {
	ProfilePlugin,
	ResourceRoute,
	ResourceRouteGroup,
} from '../../../index.js'

export interface ResourcesPaneProps {
	/**
	 * The static CSS style to apply to the outer container
	 */
	style?: React.CSSProperties

	/**
	 * The class attribute to specify on the outer container
	 */
	className?: string

	/**
	 * Whether the file-tree pane is expanded (full-width)
	 */
	expanded: boolean

	/**
	 * Toggle the file-tree expansion
	 */
	onToggleExpanded: () => void

	/**
	 * Examples to present to the user in the command-bar menu
	 */
	examples: FileDefinition[]

	/**
	 * The resource groups to render
	 */
	resources: ResourceRouteGroup[]

	/**
	 * Event handler for when a resource is selected
	 */
	onSelect: (resource: ResourceRoute) => void

	/**
	 * The currently selected item
	 */
	selectedKey?: string

	plugins: Map<string, ProfilePlugin>
}

export interface FileTreeTypes {
	style?: React.CSSProperties
	className?: string
	selectedFileId?: string
}

export type AddTableHandler = (
	parser: ParserOptions,
	file: BaseFile,
	table: TableContainer,
	fileType: DataFormat,
	shape: DataShape,
) => void

export interface FileDefinition {
	name: string
	url: string
}
