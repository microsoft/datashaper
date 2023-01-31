/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { CodebookSchema } from '@datashaper/schema'
import type { Codebook } from '@datashaper/workflow'
import { CodebookProfile as CodebookDataProfile } from '@datashaper/workflow'

import type { ProfilePlugin } from '../index.js'
import { ResourceGroupType } from '../index.js'
import { CodebookRenderer } from './renderers/CodebookRenderer.js'

export class CodebookProfile
	extends CodebookDataProfile
	implements ProfilePlugin<Codebook, CodebookSchema>
{
	public readonly title = 'Codebook'
	public readonly renderer = CodebookRenderer
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroupType.Data

	public getHelp(): Record<string, string> {
		return content
	}
}
