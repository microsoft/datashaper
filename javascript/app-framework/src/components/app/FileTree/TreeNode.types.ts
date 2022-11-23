/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceTreeData } from './FileTree.types.js'

export interface TreeNodeProps {
	node: ResourceTreeData
	expanded: boolean
	selected?: boolean
	selectedRoute?: string
	onSelectItem: (item: ResourceTreeData) => void
}
