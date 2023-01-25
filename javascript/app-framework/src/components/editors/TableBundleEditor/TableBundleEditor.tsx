/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useHelpOnMount } from '../../../hooks/useHelpOnMount.js'

import { JsonModeEditor } from '../JsonModeEditor/JsonModeEditor.js'
import { BundleEditor } from './BundleEditor.js'
import type { TableBundleEditorProps } from './TableBundleEditor.types.js'

export const TableBundleEditor: React.FC<TableBundleEditorProps> = memo(
	function TableBundleEditor({ resource }) {
		useHelpOnMount('resources.tablebundle.index')
		return (
			<JsonModeEditor resource={resource}>
				<BundleEditor resource={resource} />
			</JsonModeEditor>
		)
	},
)
