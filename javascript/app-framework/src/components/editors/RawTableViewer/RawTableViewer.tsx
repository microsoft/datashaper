/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { useDataTableSource } from '../../../hooks/index.js'
import { RawTable, RawTableDefaultFeatures } from '../../tables/index.js'
import { JsonModeEditor } from '../JsonModeEditor/JsonModeEditor.js'
import type { RawTableViewerProps } from './RawTableViewer.types.js'

export const RawTableViewer: React.FC<RawTableViewerProps> = memo(
	function RawTableViewer({ resource }) {
		const table = useDataTableSource(resource)
		return (
			<JsonModeEditor resource={resource}>
				{table?.table && (
					<RawTable features={RawTableDefaultFeatures} table={table.table} />
				)}
			</JsonModeEditor>
		)
	},
)
