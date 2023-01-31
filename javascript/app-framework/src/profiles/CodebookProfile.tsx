/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { CodebookTableStyles } from '@datashaper/react'
import type { CodebookSchema } from '@datashaper/schema'
import type { Codebook } from '@datashaper/workflow'
import { CodebookProfile as CodebookDataProfile } from '@datashaper/workflow'
import { memo } from 'react'

import { CodebookEditor } from '../components/editors/index.js'
import type { PluginComponentProps } from '../components/editors/types.js'
import type { ProfilePlugin } from '../index.js'
import { ResourceGroupType } from '../index.js'

export class CodebookProfile
	extends CodebookDataProfile
	implements ProfilePlugin<Codebook, CodebookSchema>
{
	public readonly title = 'Codebook'
	public readonly renderer = CodebookEditorView
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroupType.Data

	public getHelp(): Record<string, string> {
		return content
	}
}

const CodebookEditorView: React.FC<PluginComponentProps<Codebook>> = memo(
	function CodebookEditorView({ resource }) {
		return <CodebookEditor resource={resource} styles={styles} />
	},
)

const styles: CodebookTableStyles = {
	tableWrapper: {
		padding: 30,
	},
}
