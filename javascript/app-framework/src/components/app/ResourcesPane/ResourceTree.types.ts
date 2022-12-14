/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceRoute, ResourceRouteGroup } from '../../../types.js'

export interface ResourceTreeProps {
	expanded: boolean
	selectedRoute?: string
	resources: ResourceRouteGroup[]
	onSelect: (resource: ResourceRoute) => void
}
