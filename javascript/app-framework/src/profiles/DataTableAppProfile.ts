/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { DataTable } from '@datashaper/workflow'
import { DataTableProfile } from '@datashaper/workflow'

import type { AppProfile } from '../types.js'
import { ResourceGroupType } from '../types.js'
import { DataTableRenderer } from './renderers/DataTableRenderer.js'

export class DataTableAppProfile
	extends DataTableProfile
	implements AppProfile<DataTable>
{
	public readonly title = 'Datatable'
	public readonly renderer = DataTableRenderer
	public readonly iconName = 'PageData'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public getHelp(): Record<string, string> {
		return content
	}
}
