/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ResourceRoute,
	ResourceRouteGroup,
	ResourceSlot,
} from '../../../types.js'

export type BindingChangeHandler = (slot: ResourceSlot, key?: string) => void

export interface ResourceTreeProps {
	narrow?: boolean
	selectedRoute?: string
	resources: ResourceRouteGroup[]
	onSelect: (resource: ResourceRoute) => void
	onBindingChange?: BindingChangeHandler
}
