/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, ParserOptions } from '@datashaper/schema'
import type { DataShape } from '@datashaper/schema/dist/datatable/DataShape.js'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'

export interface FileTreeProps {
	style?: React.CSSProperties
	className?: string
	selectedFileId?: string
	expanded: boolean
	toggleExpanded: () => void
	examples?: FileDefinition[]
	appResources: ResourceTreeData[]
	selectedRoute?: string
	onSelect?: (resource: ResourceTreeData) => void
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
	 * The unique node idw
	 */
	route: string

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
