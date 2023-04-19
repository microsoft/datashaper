/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AppProfile,
	ResourceRoute,
	ResourceRouteGroup,
} from '../../../types.js'

export interface ResourceTreeProps {
	narrow?: boolean
	selectedRoute?: string
	resources: ResourceRouteGroup[]
	profiles: Map<string, AppProfile>
	onSelect: (resource: ResourceRoute) => void
}
