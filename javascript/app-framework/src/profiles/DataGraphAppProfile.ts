/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { DataGraph } from '@datashaper/workflow'
import { DataGraphProfile } from '@datashaper/workflow'

import type { AppProfile } from '../types.js'
import { ResourceGroupType } from '../types.js'
import { profileIcons } from './icons.js'
import { DataGraphRenderer } from './renderers/DataGraphRenderer.js'

export class DataGraphAppProfile
	extends DataGraphProfile
	implements AppProfile<DataGraph>
{
	public readonly title = 'DataGraph'
	public readonly renderer = DataGraphRenderer
	public readonly iconName = profileIcons.datagraph
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public getHelp(): Record<string, string> {
		return content
	}
}
