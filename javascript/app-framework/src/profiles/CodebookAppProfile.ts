/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { CodebookSchema } from '@datashaper/schema'
import type { Codebook } from '@datashaper/workflow'
import { CodebookProfile } from '@datashaper/workflow'

import type { AppProfile } from '../index.js'
import { ResourceGroupType } from '../index.js'
import { CodebookRenderer } from './renderers/CodebookRenderer.js'

export class CodebookAppProfile
	extends CodebookProfile
	implements AppProfile<Codebook, CodebookSchema>
{
	public readonly title = 'Codebook'
	public readonly renderer = CodebookRenderer
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroupType.Data

	public getHelp(): Record<string, string> {
		return content
	}
}
