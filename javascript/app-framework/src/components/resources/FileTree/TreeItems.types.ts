/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataShaperAppPlugin } from '../../../types.js'
import type { ResourceTreeData } from './FileTree.types.js'

export interface TreeItemsProps {
	expanded: boolean
	selectedRoute?: string
	onSelect?: (resource: ResourceTreeData) => void

	/**
	 * A map of profile-name to tree-node generator
	 */
	plugins: Map<string, DataShaperAppPlugin>
}
