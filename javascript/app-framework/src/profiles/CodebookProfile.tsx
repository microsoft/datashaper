/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookTableStyles } from '@datashaper/react'
import { KnownProfile } from '@datashaper/schema'
import { Codebook } from '@datashaper/workflow'
import { memo } from 'react'

import { CodebookEditor } from '../components/editors/index.js'
import type { ProfilePlugin } from '../index.js'
import { ResourceGroupType } from '../index.js'

export class CodebookProfile implements ProfilePlugin<Codebook> {
	public readonly profile = KnownProfile.Codebook
	public readonly title = 'Codebook'
	public readonly renderer = CodebookEditorView
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public createResource(): Codebook {
		return new Codebook()
	}
}

const CodebookEditorView: React.FC<{ resource: Codebook }> = memo(
	function CodebookEditorView({ resource }) {
		return <CodebookEditor resource={resource} styles={styles} />
	},
)

const styles: CodebookTableStyles = {
	tableWrapper: {
		padding: 30,
	},
}
