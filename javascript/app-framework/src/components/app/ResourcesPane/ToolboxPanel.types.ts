/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AppProfile, ResourceRouteGroup } from "../../../types.js"

export interface ToolboxPanelProps {
	onToggleExpanded: () => void
	resources: ResourceRouteGroup[]
	profiles: Map<string, AppProfile>
	selectedKey: string | undefined
}
