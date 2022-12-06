/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import { Codebook } from '@datashaper/workflow'

import type { ProfilePlugin } from '../index.js'
import { CodebookEditor, ResourceGroup } from '../index.js'

export class CodebookProfile implements ProfilePlugin<Codebook> {
	public readonly profile = KnownProfile.Codebook
	public readonly title = 'Codebook'
	public readonly renderer = CodebookEditor
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroup.Data
	public readonly dataHandler = null

	public createResource(): Codebook {
		return new Codebook()
	}
}
