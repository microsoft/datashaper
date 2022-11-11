/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FileTreeProps } from './FileTree.types.js'

export interface TreeItemsProps {
	expanded: boolean
	appLinks: FileTreeProps['appResources']
}
