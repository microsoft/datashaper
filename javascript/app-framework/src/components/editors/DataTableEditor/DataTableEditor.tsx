/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { JsonModeEditor } from '../JsonModeEditor/index.js'
import type { DataTableEditorProps } from './DataTableEditor.types.js'
import { TableEditor } from './TableEditor.js'

export const DataTableEditor: React.FC<DataTableEditorProps> = memo(
	function DataTableEditor({ resource }) {
		return (
			<JsonModeEditor resource={resource}>
				<TableEditor resource={resource} />
			</JsonModeEditor>
		)
	},
)
