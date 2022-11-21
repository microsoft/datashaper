/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SchemaResource } from '@datashaper/workflow'

import type { ResourceTreeData } from './FileTree.types.js'

/**
 * A callback function for generating a tree-item from a schema resource
 */
export type GenerateTreeItem = (r: SchemaResource) => ResourceTreeData

export interface TreeItemsProps {
	expanded: boolean
	selectedRoute?: string
	onSelect?: (resource: ResourceTreeData) => void

	/**
	 * A map of profile-name to tree-node generator
	 */
	plugins: Map<string, GenerateTreeItem>
}
