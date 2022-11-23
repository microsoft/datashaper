/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceRoute } from '../../../types.js'

export interface TreeNodeProps {
	node: ResourceRoute
	expanded: boolean
	selected?: boolean
	selectedRoute?: string
	onSelectItem: (item: ResourceRoute) => void
}
