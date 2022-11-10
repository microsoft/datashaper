/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'

import { useDataTableSource } from '../../../hooks/index.js'
import { RawTable, RawTableDefaultFeatures } from '../../tables/index.js'
import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { ViewType } from '../ViewOptions/index.js'
import { ViewOptions } from '../ViewOptions/ViewOptions.js'
import { useContent, useOnChange } from './RawTableViewer.hooks.js'
import { Container, TableContainer } from './RawTableViewer.styles.js'
import type { RawTableViewerProps } from './RawTableViewer.types.js'

export const RawTableViewer: React.FC<RawTableViewerProps> = memo(
	function RawTableViewer({ dataTable }) {
		const table = useDataTableSource(dataTable)
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const onChange = useOnChange(dataTable)
		const content = useContent(dataTable)

		return (
			<Container>
				<ViewOptions selected={viewType} onChange={setViewType} />
				{dataTable && table && (
					<TableContainer>
						{viewType === ViewType.Interactive ? (
							<RawTable features={RawTableDefaultFeatures} table={table} />
						) : (
							<JsonEditor content={content} onChange={onChange} />
						)}
					</TableContainer>
				)}
			</Container>
		)
	},
)
