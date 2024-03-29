/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AppProfile, ResourceRouteGroup } from '../../../types.js'

export interface SettingsPanelProps {
	onToggleExpanded: () => void
	resources: ResourceRouteGroup[]
	profiles: Map<string, AppProfile>
}
