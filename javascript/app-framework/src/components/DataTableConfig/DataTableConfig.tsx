/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'
import { Dropdown } from '@fluentui/react'
import { memo } from 'react'
import { Case, Switch } from 'react-if'

import { useChangeHandlers } from './DataTableConfig.hooks.js'
import {
	Container,
	FormatContainer,
	ParserContainer,
	ShapeContainer,
} from './DataTableConfig.styles.js'
import { DATA_FORMAT_OPTIONS } from './DataTableConfig.utils.js'
import { Parser } from './Parser/index.js'
import { Shape } from './Shape/Shape.js'

export interface DataTableSchemaComponentProps {
	resource: DataTable
}

export const DataTableConfig: React.FC<DataTableSchemaComponentProps> = memo(
	function DataTableConfig({ resource }) {
		const { format, onChangeFormat } = useChangeHandlers(resource)
		return (
			<Container>
				<FormatContainer>
					<Dropdown
						label="Data Format"
						options={DATA_FORMAT_OPTIONS}
						selectedKey={format}
						onChange={onChangeFormat}
					/>
				</FormatContainer>
				<Switch>
					<Case condition={format === DataFormat.CSV}>
						<ParserContainer>
							<Parser parser={resource.parser} />
						</ParserContainer>
					</Case>
					<Case condition={format === DataFormat.JSON}>
						<ShapeContainer>
							<Shape shape={resource.shape} />
						</ShapeContainer>
					</Case>
				</Switch>
			</Container>
		)
	},
)
