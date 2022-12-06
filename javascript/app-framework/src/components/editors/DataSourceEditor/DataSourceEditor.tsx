/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'

import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { ParserOptionsEditor } from '../ParserOptionsEditor/ParserOptionsEditor.js'
import { ViewType } from '../ViewOptions/index.js'
import { ViewOptions } from '../ViewOptions/ViewOptions.js'
import { useContent, useOnChange } from './DataSourceEditor.hooks.js'
import type { DataSourceEditorProps } from './DataSourceEditor.types.js'

export const DataSourceEditor: React.FC<DataSourceEditorProps> = memo(
	function DataSourceEditor({ resource: dataTable }) {
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const content = useContent(dataTable)
		const onChange = useOnChange(dataTable)

		return (
			<>
				<ViewOptions selected={viewType} onChange={setViewType} />
				{viewType === ViewType.Interactive ? (
					<ParserOptionsEditor dataTable={dataTable} />
				) : (
					<JsonEditor content={content} onChange={onChange} />
				)}
			</>
		)
	},
)
