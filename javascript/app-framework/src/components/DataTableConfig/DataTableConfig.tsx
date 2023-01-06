/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'
import { ButtonChoiceGroup } from '@essex/components'
import { memo } from 'react'
import { Case, Switch } from 'react-if'

import { useChangeHandlers } from './DataTableConfig.hooks.js'
import {
	buttonChoiceGroupStyles,
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
		console.log(resource)
		return (
			<Container>
				<FormatContainer>
					<ButtonChoiceGroup
						style={buttonChoiceGroupStyles}
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
