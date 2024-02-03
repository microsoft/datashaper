/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type { UnknownResource } from '@datashaper/workflow'
import { UnknownResourceProfile } from '@datashaper/workflow'

import type { AppProfile } from '../index.js'
import { ResourceGroupType } from '../index.js'
import { profileIcons } from './icons.js'
import { UnknownResourceRenderer } from './renderers/UnknownResourceRenderer.js'

export class UnknownResourceAppProfile
	extends UnknownResourceProfile
	implements AppProfile<UnknownResource, ResourceSchema>
{
	public readonly title = 'Unknown resource'
	public readonly renderer = UnknownResourceRenderer
	public readonly iconName = profileIcons.unknown
	public readonly group = ResourceGroupType.Data
}
