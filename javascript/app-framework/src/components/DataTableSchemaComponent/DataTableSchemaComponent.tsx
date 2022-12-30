/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import { DataFormat } from '@datashaper/schema'
import { ButtonChoiceGroup } from '@essex/components'
import { memo } from 'react'
import { Case, Switch } from 'react-if'

import { useChangeHandlers } from './DataTableSchemaComponent.hooks.js'
import {
	buttonChoiceGroupStyles,
	Container,
	FormatContainer,
	ParserContainer,
	ShapeContainer,
} from './DataTableSchemaComponent.styles.js'
import { DATA_FORMAT_OPTIONS } from './DataTableSchemaComponent.utils.js'
import { Parser } from './Parser/index.js'
import { Shape } from './Shape/Shape.js'

export interface DataTableSchemaComponentProps {
	schema: Partial<DataTableSchema>
	onChange?: (schema: Partial<DataTableSchema>) => void
}

export const DataTableSchemaComponent: React.FC<DataTableSchemaComponentProps> =
	memo(function DataTableSchemaComponent({ schema, onChange }) {
		const { onChangeFileType, onChangeParser, onChangeShape } =
			useChangeHandlers(schema, onChange)
		return (
			<Container>
				<FormatContainer>
					<ButtonChoiceGroup
						style={buttonChoiceGroupStyles}
						options={DATA_FORMAT_OPTIONS}
						selectedKey={schema.format}
						onChange={onChangeFileType}
					/>
				</FormatContainer>
				<Switch>
					<Case condition={schema?.format === DataFormat.CSV}>
						<ParserContainer>
							<Parser parser={schema.parser!} onChange={onChangeParser} />
						</ParserContainer>
					</Case>
					<Case condition={schema?.format === DataFormat.JSON}>
						<ShapeContainer>
							<Shape shape={schema.shape} onChange={onChangeShape} />
						</ShapeContainer>
					</Case>
				</Switch>
			</Container>
		)
	})
