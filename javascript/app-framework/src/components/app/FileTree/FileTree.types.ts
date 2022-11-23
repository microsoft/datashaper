/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, ParserOptions } from '@datashaper/schema'
import type { DataShape } from '@datashaper/schema/dist/datatable/DataShape.js'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'

import type { ProfileHandlerPlugin } from '../../../index.js'

export interface FileTreeProps {
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
	toggleExpanded: () => void

	/**
	 * Examples to present to the user in the command-bar menu
	 */
	examples: FileDefinition[]

	/**
	 * A map of profile-name to tree-node generator
	 */
	plugins: Map<string, ProfileHandlerPlugin>

	/**
	 * Event handler for when a resource is selected
	 */
	onSelect?: (resource: ResourceTreeData) => void

	/**
	 * The currently selected item
	 */
	selectedKey?: string
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

/**
 * Data attached to resource-tree nodes
 */
export interface ResourceTreeData {
	/**
	 * The resource render route
	 */
	href: string

	/**
	 * The node text to use. Default=id
	 */
	title: string

	/**
	 * The icon to use in the file tree
	 */
	icon?: string

	/**
	 * Child node Data
	 */
	children?: ResourceTreeData[]
}
