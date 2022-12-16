/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import { DataType, VariableNature } from '@datashaper/schema'
import styled from '@essex/styled-components'
import { Label, useTheme } from '@fluentui/react'
import type { CSSProperties } from 'react'
import { memo, useCallback } from 'react'

import { CodebookDataNatureField } from '../CodebookDataNatureField/CodebookDataNatureField.js'
import { CodebookDataTypeField } from '../CodebookDataTypeField/index.js'
import { CodebookDescriptionField } from '../CodebookDescriptionField/index.js'
import { CodebookDisplayNameField } from '../CodebookDisplayNameField/index.js'
import { CodebookStatsField } from '../CodebookStatsField/CodebookStatsField.js'
import { CodebookUnitField } from '../CodebookUnitField/index.js'
import { useFieldHeights } from '../hooks.js'
import { MappingFields } from '../MappingFields/index.js'
import { getRootStyle } from '../styles.js'
import { useTableDefaultStyles } from './Codebook.styles.js'
import type { CodebookProps } from './Codebook.types.js'

export const Codebook: React.FC<CodebookProps> = memo(function Codebook({
	fields,
	onChangeFields,
	styles,
}) {
	const heights = useFieldHeights()
	const theme = useTheme()
	const _styles = useTableDefaultStyles(styles, heights)

	const onChangeField = useCallback(
		(field: Field, index: number) => {
			const newFields = [
				...fields.slice(0, index),
				field as Field,
				...fields.slice(index + 1),
			]
			onChangeFields(newFields)
			heights.updateAllMapping(newFields)
		},
		[onChangeFields, heights, fields],
	)

	return (
		<div style={_styles?.tableWrapper}>
			<div style={_styles?.labelWrapper}>
				<Label
					style={
						_styles?.displayName?.subComponentStyles?.label as CSSProperties
					}
				>
					Display name
				</Label>
				<Label
					style={
						_styles?.description?.subComponentStyles?.label as CSSProperties
					}
				>
					Description
				</Label>
				<Label style={_styles?.dataType?.label as CSSProperties}>
					Data type
				</Label>
				<Label style={_styles?.dataNature?.label as CSSProperties}>
					Data nature
				</Label>
				<Label
					style={_styles?.units?.subComponentStyles?.label as CSSProperties}
				>
					Units
				</Label>
				<Label>Mapping</Label>
			</div>
			<Container>
				{fields.map((field: Field, index: number) => {
					return (
						<div
							key={index}
							style={getRootStyle(theme, field.exclude, _styles.root)}
						>
							<CodebookStatsField
								styles={_styles.statsWrapper}
								onChangeField={(field: Field) => onChangeField(field, index)}
								field={field}
							/>

							<CodebookDisplayNameField
								borderless
								field={field}
								styles={_styles.displayName}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>

							<CodebookDescriptionField
								field={field}
								borderless
								styles={_styles.description}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>
							<CodebookDataTypeField
								enumeration={DataType}
								field={field}
								styles={_styles.dataType}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>
							<CodebookDataNatureField
								enumeration={VariableNature}
								field={field}
								styles={_styles.dataType}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>
							<CodebookUnitField
								borderless
								field={field}
								styles={_styles.units}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>
							<MappingFields
								styles={_styles.mapping}
								field={field}
								onChangeField={(field: Field) => onChangeField(field, index)}
							/>
						</div>
					)
				})}
			</Container>
		</div>
	)
})

const Container = styled.div`
	display: flex;
	overflow: auto;
`
