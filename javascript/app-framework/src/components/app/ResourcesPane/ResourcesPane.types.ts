/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, DataTableSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'

import type {
	AppProfile,
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
	 * Whether the file-tree pane is full-width or compressed into narrow width
	 */
	narrow: boolean

	/**
	 * Toggle the file-tree narrow width expand/collapse
	 */
	onToggleNarrow: () => void

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

	profiles: Map<string, AppProfile>

	currentHelp?: string
	helpContent: Record<string, string>
}

export interface FileTreeTypes {
	style?: React.CSSProperties
	className?: string
	selectedFileId?: string
}

export type AddTableHandler = (
	file: BaseFile,
	table: TableContainer,
	schema: DataTableSchema,
	codebook?: CodebookSchema,
) => void

export interface FileDefinition {
	name: string
	url: string
}
