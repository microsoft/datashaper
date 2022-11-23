/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceRoute } from '../../../types.js'

export interface TreeItemsProps {
	expanded: boolean
	selectedRoute?: string
	resources: ResourceRoute[][]

	onSelect?: (resource: ResourceRoute) => void
}
